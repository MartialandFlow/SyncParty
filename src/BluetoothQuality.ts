import { NativeModules, Platform } from 'react-native';

export type BTResult = {
  connected: boolean;
  latencyMs: number;   // gemessene Ausgangslatenz in ms
  blocked: boolean;    // true = Latenz > 150ms (SBC/billig) → nicht erlaubt
  reason: string;
};

export async function checkAudioOutput(): Promise<BTResult> {
  if (Platform.OS !== 'android') {
    return { connected: false, codec: 'NONE', blocked: false, reason: '' };
  }
  try {
    return await NativeModules.BluetoothQuality.checkAudioOutput();
  } catch {
    return { connected: false, codec: 'UNKNOWN', blocked: false, reason: '' };
  }
}

// Latenz-Schwellwert in ms – darüber wird blockiert (typisch SBC)
export const MAX_ALLOWED_LATENCY_MS = 150;
