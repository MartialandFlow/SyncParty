import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import DJScreen from './src/screens/DJScreen';
import GuestNativeScreen from './src/screens/GuestNativeScreen';

type Screen = 'home' | 'dj' | 'guest';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const navigate = (to: Screen) => setScreen(to);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      {screen === 'home' && <HomeScreen navigate={navigate} />}
      {screen === 'dj' && <DJScreen navigate={navigate} />}
      {screen === 'guest' && <GuestNativeScreen navigate={navigate} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0f' },
});
