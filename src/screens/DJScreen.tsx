import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  Alert, ActivityIndicator, PermissionsAndroid,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import QRCode from 'react-native-qrcode-svg';
import TrackPlayer, {
  usePlaybackState, useProgress, State, Event,
} from 'react-native-track-player';
import { partyServer } from '../server/PartyServer';
import { GUEST_WEB_APP_HTML } from '../webApp';

type Props = { navigate: (s: any) => void };

const MUSIC_DIR = `${RNFS.ExternalStorageDirectoryPath}/SyncParty`;

export default function DJScreen({ navigate }: Props) {
  const [deviceIP, setDeviceIP] = useState('');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [serverStarted, setServerStarted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const isPlaying = playbackState.state === State.Playing;
  const syncInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initAll();
    return () => {
      TrackPlayer.reset();
      partyServer.stop();
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);

  async function initAll() {
    await requestPermissions();
    await getIP();
    await setupPlayer();
    await ensureMusicDir();
    startServer();
    await loadPlaylist();
  }

  async function requestPermissions() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    ]);
  }

  async function getIP() {
    const info = await NetInfo.fetch();
    const ip = (info as any).details?.ipAddress || '...';
    setDeviceIP(ip);
  }

  async function setupPlayer() {
    try { await TrackPlayer.setupPlayer(); } catch {}
    await TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT, TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
    });
    setPlayerReady(true);
  }

  async function ensureMusicDir() {
    const exists = await RNFS.exists(MUSIC_DIR);
    if (!exists) await RNFS.mkdir(MUSIC_DIR);
    partyServer.setMusicDir(MUSIC_DIR);
  }

  function startServer() {
    const unsub = partyServer.onStateChange(s => {
      setGuestCount(s.guestCount);
    });
    partyServer.start(GUEST_WEB_APP_HTML);
    setServerStarted(true);
    return unsub;
  }

  async function loadPlaylist() {
    try {
      const files = await RNFS.readDir(MUSIC_DIR);
      const mp3s = files
        .filter(f => f.name.toLowerCase().endsWith('.mp3'))
        .map(f => f.name)
        .sort();
      setPlaylist(mp3s);
      partyServer.updatePlaylist(mp3s);
    } catch {}
  }

  // ── Sync: Periodisch Position an Clients senden (bei Play) ───────────
  useEffect(() => {
    if (syncInterval.current) clearInterval(syncInterval.current);
    if (isPlaying) {
      syncInterval.current = setInterval(() => {
        // Gäste holen State per WS push - kein extra polling nötig
      }, 5000);
    }
  }, [isPlaying]);

  // ── Playback ──────────────────────────────────────────────────────────
  async function playTrack(index: number) {
    if (!playlist[index] || !playerReady) return;
    const path = `${MUSIC_DIR}/${playlist[index]}`;
    const exists = await RNFS.exists(path);
    if (!exists) { Alert.alert('Datei nicht gefunden', playlist[index]); return; }

    setCurrentIndex(index);
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: String(index),
      url: `file://${path}`,
      title: playlist[index].replace(/\.mp3$/i, ''),
      artist: 'SyncParty DJ',
    });
    await TrackPlayer.play();
    partyServer.djPlay(index, 0);
  }

  async function togglePlayPause() {
    if (isPlaying) {
      await TrackPlayer.pause();
      partyServer.djPause(position);
    } else {
      await TrackPlayer.play();
      partyServer.djPlay(currentIndex, position);
    }
  }

  async function nextTrack() {
    const next = (currentIndex + 1) % playlist.length;
    await playTrack(next);
  }

  async function prevTrack() {
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    await playTrack(prev);
  }

  function formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const qrUrl = `http://${deviceIP}:3000`;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('home')}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>🎛️ DJ Mode</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, serverStarted && styles.dotGreen]} />
            <Text style={styles.headerSub}>
              {serverStarted ? `${guestCount} Gäste • ${deviceIP}` : 'Startet...'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.qrBtn} onPress={() => setShowQR(!showQR)}>
          <Text style={styles.qrBtnText}>{showQR ? '✕' : '📱 QR'}</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code */}
      {showQR && deviceIP && (
        <View style={styles.qrBox}>
          <QRCode value={qrUrl} size={150} color="#fff" backgroundColor="#111128" />
          <Text style={styles.qrUrl}>{qrUrl}</Text>
          <Text style={styles.qrHint}>Gäste scannen diesen Code mit der Kamera</Text>
        </View>
      )}

      {/* Empty state */}
      {playlist.length === 0 && serverStarted && (
        <TouchableOpacity style={styles.emptyBox} onPress={loadPlaylist}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyTitle}>Keine MP3s gefunden</Text>
          <Text style={styles.emptyText}>
            Lege MP3-Dateien in:{'\n'}
            <Text style={styles.emptyPath}>Interner Speicher/SyncParty/</Text>
          </Text>
          <Text style={styles.emptyRefresh}>↺ Tippen zum Aktualisieren</Text>
        </TouchableOpacity>
      )}

      {!serverStarted && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#a855f7" size="large" />
          <Text style={styles.loadingText}>Server startet...</Text>
        </View>
      )}

      {/* Playlist */}
      {playlist.length > 0 && (
        <FlatList
          data={playlist}
          keyExtractor={i => i}
          style={styles.list}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.trackRow, index === currentIndex && styles.trackRowActive]}
              onPress={() => playTrack(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.trackNum}>{String(index + 1).padStart(2, '0')}</Text>
              <Text
                style={[styles.trackName, index === currentIndex && styles.trackNameActive]}
                numberOfLines={1}
              >
                {item.replace(/\.mp3$/i, '')}
              </Text>
              {index === currentIndex && isPlaying && <Text style={styles.playingDot}>▶</Text>}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Player Controls */}
      {playlist.length > 0 && (
        <View style={styles.controls}>
          <Text style={styles.nowPlayingName} numberOfLines={1}>
            {playlist[currentIndex]?.replace(/\.mp3$/i, '') || '—'}
          </Text>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={prevTrack}>
              <Text style={styles.ctrlIcon}>⏮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctrlBtn, styles.playCtrlBtn]} onPress={togglePlayPause}>
              <Text style={styles.ctrlIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctrlBtn} onPress={nextTrack}>
              <Text style={styles.ctrlIcon}>⏭</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, paddingTop: 50,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { fontSize: 24, color: '#a855f7', paddingRight: 4 },
  headerTitle: { fontSize: 19, fontWeight: '700', color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotGreen: { backgroundColor: '#22c55e' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  qrBtn: {
    backgroundColor: 'rgba(168,85,247,0.18)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(168,85,247,0.4)',
  },
  qrBtnText: { color: '#a855f7', fontWeight: '600', fontSize: 13 },
  qrBox: {
    alignItems: 'center', padding: 20, margin: 16,
    backgroundColor: '#111128', borderRadius: 20, gap: 8,
  },
  qrUrl: { color: '#a855f7', fontSize: 14, fontWeight: '600', marginTop: 4 },
  qrHint: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22 },
  emptyPath: { color: '#a855f7', fontWeight: '600' },
  emptyRefresh: { fontSize: 13, color: 'rgba(168,85,247,0.6)', marginTop: 4 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  list: { flex: 1 },
  trackRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  trackRowActive: { backgroundColor: 'rgba(168,85,247,0.1)' },
  trackNum: { fontSize: 12, color: 'rgba(255,255,255,0.3)', width: 26 },
  trackName: { flex: 1, fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  trackNameActive: { color: '#a855f7', fontWeight: '600' },
  playingDot: { fontSize: 12, color: '#a855f7' },
  controls: {
    padding: 20, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
    backgroundColor: '#0d0d17',
  },
  nowPlayingName: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 12 },
  progressBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 14 },
  timeText: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  btns: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18 },
  ctrlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  playCtrlBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#a855f7' },
  ctrlIcon: { fontSize: 22 },
});
