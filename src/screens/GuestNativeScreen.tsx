import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Switch, Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { checkAudioOutput, BTResult } from '../BluetoothQuality';

type Props = { navigate: (s: any) => void };

// Offset-Schritte in ms (für den Regler)
const OFFSET_STEPS = [-300, -200, -150, -100, -50, 0, 50, 100, 150, 200, 300];

export default function GuestNativeScreen({ navigate }: Props) {
  const [ip, setIp] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [boxMode, setBoxMode] = useState(false);
  const [offsetIndex, setOffsetIndex] = useState(5); // 0ms default
  const [btStatus, setBtStatus] = useState<BTResult | null>(null);
  const [checkingBT, setCheckingBT] = useState(false);

  const offsetMs = OFFSET_STEPS[offsetIndex];

  // Bluetooth prüfen wenn Box-Modus aktiviert wird
  useEffect(() => {
    if (!boxMode) { setBtStatus(null); return; }
    setCheckingBT(true);
    checkAudioOutput().then(result => {
      setBtStatus(result);
      setCheckingBT(false);
      if (result.blocked) {
        Alert.alert(
          '❌ Bluetooth nicht kompatibel',
          result.reason,
          [{ text: 'Verstanden', onPress: () => setBoxMode(false) }]
        );
      }
    });
  }, [boxMode]);

  function connect() {
    if (!ip.trim()) return;
    if (boxMode && btStatus?.blocked) return;
    // Offset als Query-Parameter mitgeben → Web-App wertet ihn aus
    const offsetParam = boxMode ? `?offset=${offsetMs}&boxmode=1` : '';
    setUrl(`http://${ip.trim()}:3000${offsetParam}`);
    setLoading(true);
  }

  const canConnect = !checkingBT && !(boxMode && btStatus?.blocked);

  // ── WebView (verbunden) ────────────────────────────────────────────
  if (url) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
        {loading && (
          <View style={styles.webLoading}>
            <ActivityIndicator size="large" color="#a855f7" />
            <Text style={styles.webLoadingText}>Verbinde mit DJ...</Text>
          </View>
        )}
        <WebView
          source={{ uri: url }}
          style={{ flex: 1, opacity: loading ? 0 : 1 }}
          onLoadEnd={() => setLoading(false)}
          onError={() => { setLoading(false); setUrl(''); }}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => { setUrl(''); navigate('home'); }}>
          <Text style={styles.backBtnText}>← Verlassen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Join Screen ────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={styles.backLink} onPress={() => navigate('home')}>
        <Text style={styles.backLinkText}>← Zurück</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.icon}>{boxMode ? '🔊' : '🎧'}</Text>
        <Text style={styles.title}>Party beitreten</Text>
        <Text style={styles.subtitle}>
          Frag den DJ nach der IP-Adresse{'\n'}oder scanne den QR-Code mit der Kamera
        </Text>

        <TextInput
          style={styles.input}
          placeholder="192.168.1.100"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={ip}
          onChangeText={setIp}
          keyboardType="numeric"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={connect}
        />

        {/* ── Box-Modus Toggle ─────────────────────────────── */}
        <View style={styles.boxModeRow}>
          <View>
            <Text style={styles.boxModeLabel}>🔊 Box-Modus</Text>
            <Text style={styles.boxModeSub}>Für Lautsprecher statt Kopfhörer</Text>
          </View>
          <Switch
            value={boxMode}
            onValueChange={setBoxMode}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#a855f7' }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Bluetooth Status ──────────────────────────────── */}
        {boxMode && (
          <View style={styles.btStatus}>
            {checkingBT ? (
              <View style={styles.btRow}>
                <ActivityIndicator size="small" color="#a855f7" />
                <Text style={styles.btText}>Prüfe Audioverbindung...</Text>
              </View>
            ) : btStatus ? (
              <View style={styles.btRow}>
                <Text style={styles.btDot}>
                  {btStatus.blocked ? '🔴' : btStatus.connected ? '🟢' : '🔵'}
                </Text>
                <View>
                  <Text style={[styles.btText, btStatus.blocked && styles.btBlocked]}>
                    {btStatus.connected
                      ? `Bluetooth: ${btStatus.latencyMs}ms Latenz`
                      : 'Kabel / interner Lautsprecher ✓'}
                  </Text>
                  {btStatus.blocked && (
                    <Text style={styles.btBlockedSub}>
                      SBC zu langsam – AUX oder aptX/AAC/LDAC verwenden
                    </Text>
                  )}
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* ── Offset-Regler (nur im Box-Modus) ─────────────── */}
        {boxMode && !btStatus?.blocked && (
          <View style={styles.offsetBox}>
            <Text style={styles.offsetLabel}>
              Bluetooth-Verzögerung: <Text style={styles.offsetValue}>
                {offsetMs === 0 ? '±0 ms' : `${offsetMs > 0 ? '+' : ''}${offsetMs} ms`}
              </Text>
            </Text>
            <View style={styles.offsetRow}>
              <TouchableOpacity
                style={[styles.offsetBtn, offsetIndex === 0 && styles.offsetBtnDisabled]}
                onPress={() => setOffsetIndex(i => Math.max(0, i - 1))}
              >
                <Text style={styles.offsetBtnText}>−</Text>
              </TouchableOpacity>

              <View style={styles.offsetTrack}>
                {OFFSET_STEPS.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setOffsetIndex(i)}
                    style={[styles.offsetDot, i === offsetIndex && styles.offsetDotActive]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.offsetBtn, offsetIndex === OFFSET_STEPS.length - 1 && styles.offsetBtnDisabled]}
                onPress={() => setOffsetIndex(i => Math.min(OFFSET_STEPS.length - 1, i + 1))}
              >
                <Text style={styles.offsetBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.offsetHint}>
              Wenn Boxen versetzt klingen → Wert erhöhen
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, !canConnect && styles.btnDisabled]}
          onPress={connect}
          activeOpacity={0.85}
          disabled={!canConnect}
        >
          <Text style={styles.btnText}>
            {boxMode ? 'Box verbinden 🔊' : 'Verbinden 🎵'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Tipp: Der QR-Code auf dem DJ-Screen öffnet{'\n'}die Party direkt im Browser
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  backLink: { paddingTop: 52, paddingLeft: 24 },
  backLinkText: { color: '#a855f7', fontSize: 16 },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 28, gap: 14,
  },
  icon: { fontSize: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 22 },
  input: {
    width: '100%', padding: 18, borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(168,85,247,0.4)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: 20, textAlign: 'center', marginTop: 4,
  },

  // Box-Modus
  boxModeRow: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  boxModeLabel: { fontSize: 15, fontWeight: '600', color: '#fff' },
  boxModeSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  // Bluetooth Status
  btStatus: {
    width: '100%', padding: 14, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  btRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  btDot: { fontSize: 16, marginTop: 1 },
  btText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  btBlocked: { color: '#f87171' },
  btBlockedSub: { fontSize: 12, color: '#f87171', marginTop: 3, opacity: 0.8 },

  // Offset
  offsetBox: {
    width: '100%', padding: 16, borderRadius: 16,
    backgroundColor: 'rgba(168,85,247,0.08)',
    borderWidth: 1, borderColor: 'rgba(168,85,247,0.2)',
    gap: 10,
  },
  offsetLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  offsetValue: { color: '#a855f7', fontWeight: '700', fontSize: 15 },
  offsetRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  offsetBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(168,85,247,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  offsetBtnDisabled: { opacity: 0.3 },
  offsetBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 24 },
  offsetTrack: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  offsetDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  offsetDotActive: { backgroundColor: '#a855f7', width: 12, height: 12, borderRadius: 6 },
  offsetHint: { fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },

  btn: { width: '100%', padding: 18, borderRadius: 16, backgroundColor: '#a855f7', alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 20 },
  webLoading: {
    ...StyleSheet.absoluteFillObject, alignItems: 'center',
    justifyContent: 'center', gap: 16, zIndex: 10,
  },
  webLoadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  backBtn: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: 'rgba(10,10,15,0.95)', alignItems: 'center',
  },
  backBtnText: { color: '#a855f7', fontSize: 16, fontWeight: '600' },
});
