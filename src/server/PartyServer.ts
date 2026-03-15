/**
 * Einfacher HTTP + WebSocket Server der direkt in React Native läuft.
 * Nutzt react-native-tcp-socket für TCP-Verbindungen.
 */
import TcpSocket from 'react-native-tcp-socket';
import RNFS from 'react-native-fs';
import crypto from 'react-native-tcp-socket'; // WS-key via native

// WebSocket frame helpers
function createWSAcceptKey(key: string): string {
  // react-native hat kein crypto built-in, wir nutzen eine simple JS-Implementierung
  // Für WebSocket Handshake: SHA1(key + GUID) base64
  const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return sha1Base64(key + GUID);
}

// Minimale SHA1 für WebSocket Handshake (Jones' compact SHA1)
function sha1Base64(str: string): string {
  function rotl(n: number, s: number) { return (n << s) | (n >>> (32 - s)); }
  function tohex(i: number) { return ('0000000' + i.toString(16)).slice(-8); }

  const msg = unescape(encodeURIComponent(str));
  const W: number[] = [];
  let H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0;

  const bytes: number[] = [];
  for (let i = 0; i < msg.length; i++) bytes.push(msg.charCodeAt(i));
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = msg.length * 8;
  bytes.push(0, 0, 0, 0, (bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);

  for (let i = 0; i < bytes.length; i += 64) {
    for (let j = 0; j < 16; j++) {
      W[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
    }
    for (let j = 16; j < 80; j++) W[j] = rotl(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
    let a = H0, b = H1, c = H2, d = H3, e = H4;
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20)      { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (j < 40) { f = b ^ c ^ d;           k = 0x6ED9EBA1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else             { f = b ^ c ^ d;           k = 0xCA62C1D6; }
      const tmp = rotl(a, 5) + f + e + k + W[j];
      e = d; d = c; c = rotl(b, 30); b = a; a = tmp;
    }
    H0 += a; H1 += b; H2 += c; H3 += d; H4 += e;
  }

  const hex = tohex(H0) + tohex(H1) + tohex(H2) + tohex(H3) + tohex(H4);
  const bytes2: number[] = [];
  for (let i = 0; i < hex.length; i += 2) bytes2.push(parseInt(hex.substr(i, 2), 16));
  return btoa(String.fromCharCode(...bytes2));
}

// WS Frame erstellen
function makeWSFrame(data: string): Buffer {
  const payload = Buffer.from(data, 'utf8');
  const len = payload.length;
  let header: Buffer;

  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // FIN + text frame
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeUInt32BE(0, 2);
    header.writeUInt32BE(len, 6);
  }
  return Buffer.concat([header, payload]);
}

// WS Frame parsen (vom Client)
function parseWSFrame(buf: Buffer): string | null {
  if (buf.length < 2) return null;
  const masked = (buf[1] & 0x80) !== 0;
  let payloadLen = buf[1] & 0x7f;
  let offset = 2;

  if (payloadLen === 126) { payloadLen = buf.readUInt16BE(2); offset = 4; }
  else if (payloadLen === 127) { payloadLen = buf.readUInt32BE(6); offset = 10; }

  const mask = masked ? buf.slice(offset, offset + 4) : null;
  offset += masked ? 4 : 0;

  if (buf.length < offset + payloadLen) return null;
  const payload = Buffer.alloc(payloadLen);
  for (let i = 0; i < payloadLen; i++) {
    payload[i] = masked ? buf[offset + i] ^ mask![i % 4] : buf[offset + i];
  }
  return payload.toString('utf8');
}

// ── Haupt-Server-Klasse ────────────────────────────────────────────────
export type ServerState = {
  status: 'stopped' | 'playing' | 'paused';
  trackIndex: number;
  trackName: string;
  position: number;
  timestamp: number;
  playlist: string[];
  guestCount: number;
};

type StateListener = (state: ServerState) => void;

export class PartyServer {
  private server: ReturnType<typeof TcpSocket.createServer> | null = null;
  private wsClients: Set<any> = new Set();
  private musicDir: string = '';
  private state: ServerState = {
    status: 'stopped',
    trackIndex: 0,
    trackName: '',
    position: 0,
    timestamp: 0,
    playlist: [],
    guestCount: 0,
  };
  private listeners: StateListener[] = [];
  readonly port = 3000;

  onStateChange(listener: StateListener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  setMusicDir(dir: string) {
    this.musicDir = dir;
  }

  updatePlaylist(playlist: string[]) {
    this.state.playlist = playlist;
    this.notify();
  }

  // ── State-Änderungen vom DJ ──────────────────────────────────────────
  djPlay(trackIndex: number, position: number) {
    this.state.status = 'playing';
    this.state.trackIndex = trackIndex;
    this.state.trackName = this.state.playlist[trackIndex] || '';
    this.state.position = position;
    this.state.timestamp = Date.now();
    this.broadcastState();
    this.notify();
  }

  djPause(position: number) {
    this.state.status = 'paused';
    this.state.position = position;
    this.state.timestamp = Date.now();
    this.broadcastState();
    this.notify();
  }

  // ── Broadcast an alle WS-Clients ─────────────────────────────────────
  private broadcastState() {
    const data = JSON.stringify(this.currentStateWithPosition());
    const frame = makeWSFrame(JSON.stringify({ type: 'state', data }));
    for (const client of this.wsClients) {
      try { client.write(frame); } catch {}
    }
  }

  broadcastReaction(emoji: string) {
    const frame = makeWSFrame(JSON.stringify({ type: 'reaction', emoji }));
    for (const client of this.wsClients) {
      try { client.write(frame); } catch {}
    }
  }

  private currentStateWithPosition() {
    const delay = this.state.status === 'playing'
      ? (Date.now() - this.state.timestamp) / 1000
      : 0;
    return { ...this.state, position: this.state.position + delay, timestamp: Date.now() };
  }

  // ── HTTP Server ───────────────────────────────────────────────────────
  start(webAppHtml: string) {
    this.server = TcpSocket.createServer((socket) => {
      let buffer = Buffer.alloc(0);
      let isWS = false;

      socket.on('data', async (data: Buffer | string) => {
        const chunk = typeof data === 'string' ? Buffer.from(data) : data;

        if (isWS) {
          const msg = parseWSFrame(chunk);
          if (msg) {
            try {
              const parsed = JSON.parse(msg);
              if (parsed.type === 'reaction') {
                this.broadcastReaction(parsed.emoji);
              }
            } catch {}
          }
          return;
        }

        buffer = Buffer.concat([buffer, chunk]);
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;

        const headerStr = buffer.slice(0, headerEnd).toString('utf8');
        const lines = headerStr.split('\r\n');
        const [method, path] = lines[0].split(' ');

        // WebSocket Upgrade
        if (headerStr.includes('Upgrade: websocket')) {
          const keyMatch = headerStr.match(/Sec-WebSocket-Key: (.+)/);
          if (!keyMatch) { socket.destroy(); return; }
          const acceptKey = createWSAcceptKey(keyMatch[1].trim());
          const response =
            'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`;
          socket.write(response);
          isWS = true;
          this.wsClients.add(socket);
          this.state.guestCount = this.wsClients.size;
          this.notify();

          // Sofort aktuellen State senden
          const frame = makeWSFrame(JSON.stringify({ type: 'state', data: JSON.stringify(this.currentStateWithPosition()) }));
          try { socket.write(frame); } catch {}

          socket.on('close', () => {
            this.wsClients.delete(socket);
            this.state.guestCount = this.wsClients.size;
            this.notify();
          });
          return;
        }

        // HTTP Requests
        buffer = Buffer.alloc(0);
        const decodedPath = decodeURIComponent(path?.split('?')[0] || '/');

        if (method === 'GET' && (decodedPath === '/' || decodedPath === '/index.html')) {
          const html = webAppHtml;
          const response =
            'HTTP/1.1 200 OK\r\n' +
            'Content-Type: text/html; charset=utf-8\r\n' +
            `Content-Length: ${Buffer.byteLength(html)}\r\n` +
            'Connection: close\r\n\r\n' +
            html;
          socket.write(response);
          socket.end();
          return;
        }

        if (method === 'GET' && decodedPath === '/api/state') {
          const json = JSON.stringify(this.currentStateWithPosition());
          const response =
            'HTTP/1.1 200 OK\r\n' +
            'Content-Type: application/json\r\n' +
            `Content-Length: ${Buffer.byteLength(json)}\r\n` +
            'Access-Control-Allow-Origin: *\r\n' +
            'Connection: close\r\n\r\n' +
            json;
          socket.write(response);
          socket.end();
          return;
        }

        if (method === 'GET' && decodedPath.startsWith('/music/')) {
          const filename = decodedPath.slice(7);
          const filePath = `${this.musicDir}/${filename}`;

          try {
            const stat = await RNFS.stat(filePath);
            const rangeHeader = headerStr.match(/Range: bytes=(\d+)-(\d*)/);

            if (rangeHeader) {
              const start = parseInt(rangeHeader[1]);
              const end = rangeHeader[2] ? parseInt(rangeHeader[2]) : stat.size - 1;
              const chunkSize = end - start + 1;

              const header =
                'HTTP/1.1 206 Partial Content\r\n' +
                'Content-Type: audio/mpeg\r\n' +
                `Content-Range: bytes ${start}-${end}/${stat.size}\r\n` +
                `Content-Length: ${chunkSize}\r\n` +
                'Accept-Ranges: bytes\r\n' +
                'Connection: close\r\n\r\n';
              socket.write(header);

              const content = await RNFS.read(filePath, chunkSize, start, 'base64');
              socket.write(Buffer.from(content, 'base64'));
            } else {
              const header =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: audio/mpeg\r\n' +
                `Content-Length: ${stat.size}\r\n` +
                'Accept-Ranges: bytes\r\n' +
                'Connection: close\r\n\r\n';
              socket.write(header);

              const content = await RNFS.read(filePath, stat.size, 0, 'base64');
              socket.write(Buffer.from(content, 'base64'));
            }
          } catch {
            socket.write('HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n');
          }
          socket.end();
          return;
        }

        socket.write('HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n');
        socket.end();
      });

      socket.on('error', () => {
        if (isWS) {
          this.wsClients.delete(socket);
          this.state.guestCount = this.wsClients.size;
          this.notify();
        }
      });
    });

    this.server.listen({ port: this.port, host: '0.0.0.0' }, () => {
      console.log(`PartyServer listening on port ${this.port}`);
    });

    this.server.on('error', (err: Error) => {
      console.error('Server error:', err);
    });
  }

  stop() {
    this.server?.close();
    this.server = null;
    this.wsClients.clear();
  }
}

export const partyServer = new PartyServer();
