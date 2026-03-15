// Gast Web-App — wird vom DJ-Phone als HTTP Response ausgeliefert
// Nutzt native WebSocket API (kein socket.io)
export const GUEST_WEB_APP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>SyncParty</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: #a855f7;
      --accent2: #ec4899;
      --bg: #0a0a0f;
      --surface: rgba(255,255,255,0.05);
      --text: #f0f0f0;
      --muted: rgba(255,255,255,0.4);
    }
    html, body {
      height: 100%; background: var(--bg); color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    #join-screen {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 100%; gap: 24px; padding: 32px;
      background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 70%);
    }
    .logo { font-size: 52px; margin-bottom: 8px; }
    .join-title {
      font-size: 30px; font-weight: 700;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .join-subtitle { color: var(--muted); font-size: 15px; text-align: center; }
    #name-input {
      width: 100%; max-width: 300px; padding: 16px 20px;
      border-radius: 16px; border: 2px solid rgba(168,85,247,0.4);
      background: rgba(255,255,255,0.07); color: var(--text);
      font-size: 18px; outline: none; text-align: center;
    }
    #name-input:focus { border-color: var(--accent); }
    #name-input::placeholder { color: var(--muted); }
    #join-btn {
      width: 100%; max-width: 300px; padding: 18px;
      border-radius: 16px; border: none;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: white; font-size: 18px; font-weight: 700; cursor: pointer;
    }
    #join-btn:active { opacity: 0.85; transform: scale(0.97); }
    #player-screen {
      display: none; flex-direction: column; height: 100%; position: relative; overflow: hidden;
    }
    #bg-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 60%, rgba(168,85,247,0.2) 0%, transparent 65%),
                  radial-gradient(ellipse at 20% 20%, rgba(236,72,153,0.15) 0%, transparent 50%);
      z-index: 0; transition: opacity 1s;
    }
    #listeners-bar {
      position: relative; z-index: 10;
      padding: 16px 24px 8px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #listeners-count { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
      animation: pulse-dot 2s infinite;
    }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
    #my-name-badge {
      font-size: 12px; color: var(--muted);
      background: var(--surface); padding: 4px 12px; border-radius: 20px;
    }
    #visualizer-container {
      position: relative; z-index: 10; flex: 1;
      display: flex; align-items: center; justify-content: center; padding: 0 16px;
    }
    #visualizer { width: 100%; max-height: 160px; border-radius: 12px; }
    #track-info { position: relative; z-index: 10; padding: 16px 28px 8px; text-align: center; }
    #track-name { font-size: 22px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #track-status { font-size: 13px; color: var(--muted); margin-top: 4px; }
    #progress-container { position: relative; z-index: 10; padding: 12px 28px; }
    #progress-bar-bg { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
    #progress-bar-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 0.5s linear;
    }
    #time-display { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 6px; }
    #reactions-container { position: relative; z-index: 10; padding: 8px 24px 20px; }
    #reactions-label { font-size: 12px; color: var(--muted); text-align: center; margin-bottom: 10px; }
    #reaction-buttons { display: flex; justify-content: center; gap: 14px; }
    .reaction-btn {
      font-size: 26px; background: var(--surface);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      width: 54px; height: 54px; display: flex; align-items: center;
      justify-content: center; cursor: pointer; transition: transform 0.15s;
    }
    .reaction-btn:active { transform: scale(1.3); background: rgba(168,85,247,0.3); }
    .float-reaction {
      position: fixed; font-size: 32px; pointer-events: none; z-index: 100;
      animation: float-up 2.5s ease-out forwards;
    }
    @keyframes float-up {
      0%   { transform: translateY(0) scale(1);       opacity: 1; }
      100% { transform: translateY(-250px) scale(1.4); opacity: 0; }
    }
    #loading-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(10,10,15,0.9); z-index: 200;
      flex-direction: column; align-items: center; justify-content: center; gap: 20px;
    }
    #loading-overlay.active { display: flex; }
    .loading-spinner {
      width: 48px; height: 48px; border: 3px solid rgba(168,85,247,0.2);
      border-top-color: var(--accent); border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #loading-text { font-size: 16px; color: var(--muted); }
    audio { display: none; }
  </style>
</head>
<body>
<div id="join-screen">
  <div class="logo">🎧</div>
  <div class="join-title">SyncParty</div>
  <div class="join-subtitle">Gib deinen Namen ein und hör mit</div>
  <input id="name-input" type="text" placeholder="Dein Name..." maxlength="20" autocomplete="off" />
  <button id="join-btn">Beitreten 🎵</button>
</div>

<div id="player-screen">
  <div id="bg-glow"></div>
  <div id="listeners-bar">
    <div id="listeners-count">
      <div class="live-dot"></div>
      <span id="listeners-num">0</span> hören mit
    </div>
    <div id="my-name-badge"></div>
  </div>
  <div id="visualizer-container">
    <canvas id="visualizer"></canvas>
  </div>
  <div id="track-info">
    <div id="track-name">Warte auf DJ...</div>
    <div id="track-status">Verbunden</div>
  </div>
  <div id="progress-container">
    <div id="progress-bar-bg"><div id="progress-bar-fill"></div></div>
    <div id="time-display">
      <span id="time-current">0:00</span>
      <span id="time-total">0:00</span>
    </div>
  </div>
  <div id="reactions-container">
    <div id="reactions-label">Reagiere auf alle</div>
    <div id="reaction-buttons">
      <div class="reaction-btn" data-emoji="🔥">🔥</div>
      <div class="reaction-btn" data-emoji="💃">💃</div>
      <div class="reaction-btn" data-emoji="😍">😍</div>
      <div class="reaction-btn" data-emoji="🎵">🎵</div>
      <div class="reaction-btn" data-emoji="🙌">🙌</div>
    </div>
  </div>
</div>

<div id="loading-overlay">
  <div class="loading-spinner"></div>
  <div id="loading-text">Lade Track...</div>
</div>

<audio id="audio-player" preload="none"></audio>

<script>
var myName = '';
var ws = null;
var audioCtx = null;
var analyser = null;
var sourceNode = null;
var animFrame = null;
var currentTrack = '';
var progressInterval = null;
var audio = document.getElementById('audio-player');

// Offset aus URL-Parameter lesen (Box-Modus)
var params = new URLSearchParams(window.location.search);
var offsetMs = parseInt(params.get('offset') || '0', 10);
var boxMode = params.get('boxmode') === '1';
var offsetSeconds = offsetMs / 1000;

document.getElementById('join-btn').addEventListener('click', joinParty);
document.getElementById('name-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') joinParty();
});

function joinParty() {
  var nameInput = document.getElementById('name-input');
  var name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  myName = name;

  document.getElementById('join-screen').style.display = 'none';
  var ps = document.getElementById('player-screen');
  ps.style.display = 'flex';
  ps.style.flexDirection = 'column';
  document.getElementById('my-name-badge').textContent = boxMode
    ? '🔊 Box-Modus' + (offsetMs !== 0 ? ' ' + (offsetMs > 0 ? '+' : '') + offsetMs + 'ms' : '')
    : myName;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  analyser.connect(audioCtx.destination);

  connectWS();
  startVisualizer();
}

function connectWS() {
  var wsUrl = 'ws://' + location.host;
  ws = new WebSocket(wsUrl);

  ws.onmessage = function(evt) {
    try {
      var msg = JSON.parse(evt.data);
      if (msg.type === 'state') {
        var state = JSON.parse(msg.data);
        handleState(state);
      } else if (msg.type === 'reaction') {
        showFloatingReaction(msg.emoji);
      }
    } catch(e) {}
  };

  ws.onclose = function() {
    setTimeout(connectWS, 2000);
  };
}

function handleState(state) {
  document.getElementById('listeners-num').textContent = state.guestCount || '?';
  if (!state.trackName) return;

  var displayName = state.trackName.replace(/\\.mp3$/i, '');
  document.getElementById('track-name').textContent = displayName;

  if (state.status === 'playing') {
    document.getElementById('track-status').textContent = '▶ Läuft';
    document.getElementById('bg-glow').style.opacity = '1';
  } else if (state.status === 'paused') {
    document.getElementById('track-status').textContent = '⏸ Pausiert';
    document.getElementById('bg-glow').style.opacity = '0.4';
    audio.pause();
    return;
  }

  var trackChanged = state.trackName !== currentTrack;
  if (trackChanged) {
    currentTrack = state.trackName;
    loadAndSync(state);
  } else {
    syncPosition(state);
  }
}

function loadAndSync(state) {
  showLoading(true);
  var url = '/music/' + encodeURIComponent(state.trackName);
  audio.src = url;

  if (!sourceNode) {
    sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyser);
  }

  audio.load();

  function onCanPlay() {
    audio.removeEventListener('canplay', onCanPlay);
    showLoading(false);
    syncPosition(state);
    startProgressUpdater();
  }

  audio.addEventListener('canplay', onCanPlay);
}

function syncPosition(state) {
  if (!state.trackName) return;
  var delay = (Date.now() - state.timestamp) / 1000;
  // Offset addieren: positive Werte = Wiedergabe verzögern (Box braucht länger)
  var targetPos = state.position + delay + offsetSeconds;

  if (Math.abs(audio.currentTime - targetPos) > 0.5) {
    audio.currentTime = Math.max(0, targetPos);
  }
  if (state.status === 'playing' && audio.paused) {
    audio.play().catch(function(){});
  } else if (state.status !== 'playing' && !audio.paused) {
    audio.pause();
  }
}

function startProgressUpdater() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(function() {
    if (!audio.duration || isNaN(audio.duration)) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-bar-fill').style.width = pct + '%';
    document.getElementById('time-current').textContent = formatTime(audio.currentTime);
    document.getElementById('time-total').textContent = formatTime(audio.duration);
  }, 500);
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0');
}

function startVisualizer() {
  var canvas = document.getElementById('visualizer');
  var ctx = canvas.getContext('2d');
  var BAR_COUNT = 38;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    animFrame = requestAnimationFrame(draw);
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    var values;
    if (analyser && !audio.paused) {
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      values = Array.from({length: BAR_COUNT}, function(_, i) {
        return data[Math.floor(i * data.length / BAR_COUNT)] / 255;
      });
    } else {
      var t = Date.now() / 1000;
      values = Array.from({length: BAR_COUNT}, function(_, i) {
        return 0.05 + 0.07 * Math.sin(t * 1.8 + i * 0.4);
      });
    }

    var barW = (W / BAR_COUNT) * 0.6;
    var gap = (W / BAR_COUNT) * 0.4;
    values.forEach(function(v, i) {
      var barH = Math.max(4, v * H * 0.88);
      var x = i * (barW + gap) + gap / 2;
      var y = (H - barH) / 2;
      var grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, 'rgba(168,85,247,' + (0.6 + v * 0.4) + ')');
      grad.addColorStop(1, 'rgba(236,72,153,' + (0.6 + v * 0.4) + ')');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, barW/3);
      else ctx.rect(x, y, barW, barH);
      ctx.fill();
    });
  }
  draw();
}

document.querySelectorAll('.reaction-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var emoji = btn.dataset.emoji;
    if (ws && ws.readyState === 1) ws.send(JSON.stringify({type:'reaction', emoji:emoji}));
    showFloatingReaction(emoji);
  });
});

function showFloatingReaction(emoji) {
  var el = document.createElement('div');
  el.className = 'float-reaction';
  el.textContent = emoji;
  el.style.left = (15 + Math.random() * 65) + '%';
  el.style.bottom = '120px';
  document.body.appendChild(el);
  setTimeout(function(){ el.remove(); }, 2600);
}

function showLoading(show) {
  var el = document.getElementById('loading-overlay');
  if (show) { el.classList.add('active'); document.getElementById('loading-text').textContent = 'Lade Track...'; }
  else el.classList.remove('active');
}
</script>
</body>
</html>`;
