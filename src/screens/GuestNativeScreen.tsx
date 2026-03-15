import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

type Props = { navigate: (s: any) => void };

export default function GuestNativeScreen({ navigate }: Props) {
  const [ip, setIp] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  function connect() {
    if (!ip.trim()) return;
    setUrl(`http://${ip.trim()}:3000`);
    setLoading(true);
  }

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={styles.backLink} onPress={() => navigate('home')}>
        <Text style={styles.backLinkText}>← Zurück</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.icon}>🎧</Text>
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

        <TouchableOpacity style={styles.btn} onPress={connect} activeOpacity={0.85}>
          <Text style={styles.btnText}>Verbinden 🎵</Text>
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
    padding: 32, gap: 16,
  },
  icon: { fontSize: 64 },
  title: { fontSize: 26, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 22 },
  input: {
    width: '100%', padding: 18, borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(168,85,247,0.4)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: 20, textAlign: 'center', marginTop: 8,
  },
  btn: { width: '100%', padding: 18, borderRadius: 16, backgroundColor: '#a855f7', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 20, marginTop: 12 },
  webLoading: {
    ...StyleSheet.absoluteFillObject, alignItems: 'center',
    justifyContent: 'center', gap: 16, zIndex: 10,
  },
  webLoadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  backBtn: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: 'rgba(10,10,15,0.95)',
    alignItems: 'center',
  },
  backBtnText: { color: '#a855f7', fontSize: 16, fontWeight: '600' },
});
