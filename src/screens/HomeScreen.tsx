import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = { navigate: (s: any) => void };

export default function HomeScreen({ navigate }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🎧</Text>
        <Text style={styles.title}>SyncParty</Text>
        <Text style={styles.subtitle}>Musik synchron – ohne Internet</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.btn, styles.btnDJ]} onPress={() => navigate('dj')} activeOpacity={0.85}>
          <Text style={styles.btnIcon}>🎛️</Text>
          <View>
            <Text style={styles.btnTitle}>DJ werden</Text>
            <Text style={styles.btnSub}>Musik auflegen & Gäste einladen</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnGuest]} onPress={() => navigate('guest')} activeOpacity={0.85}>
          <Text style={styles.btnIcon}>🎵</Text>
          <View>
            <Text style={styles.btnTitle}>Mithören</Text>
            <Text style={styles.btnSub}>IP eingeben oder QR scannen</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Alle müssen im gleichen WLAN sein</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0f',
    alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 60, paddingHorizontal: 28,
  },
  hero: { alignItems: 'center', gap: 8 },
  logo: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 4 },
  buttons: { width: '100%', gap: 16 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22, borderRadius: 20 },
  btnDJ: { backgroundColor: '#a855f7' },
  btnGuest: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  btnIcon: { fontSize: 32 },
  btnTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  btnSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  hint: { fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' },
});
