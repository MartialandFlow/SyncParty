package com.syncparty

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioDeviceInfo
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import com.facebook.react.bridge.*

class BluetoothQualityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "BluetoothQuality"

    /**
     * Prüft den aktuellen Audio-Ausgang:
     * - Ist Bluetooth verbunden?
     * - Wie hoch ist die Latenz? (via AudioTrack.getLatency Reflection)
     * - Latenz > 150ms → blockiert (typisch für SBC / Billig-Bluetooth)
     *
     * Gibt zurück:
     *   { connected: Boolean, latencyMs: Int, blocked: Boolean, reason: String }
     */
    @ReactMethod
    fun checkAudioOutput(promise: Promise) {
        try {
            val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val devices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)

            val btDevice = devices.firstOrNull {
                it.type == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP ||
                it.type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO
            }

            // AudioTrack erstellen um tatsächliche Latenz zu messen
            val minBufSize = AudioTrack.getMinBufferSize(
                44100,
                AudioFormat.CHANNEL_OUT_STEREO,
                AudioFormat.ENCODING_PCM_16BIT
            )

            val track = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setSampleRate(44100)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .build()
                )
                .setBufferSizeInBytes(minBufSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            // Latenz via Reflection (hidden API aber stabil seit API 21)
            val latencyMs: Int = try {
                val method = AudioTrack::class.java.getMethod("getLatency")
                method.invoke(track) as Int
            } catch (e: Exception) {
                // Fallback: AudioManager Output-Latenz
                audioManager.getProperty("android.media.property.OUTPUT_LATENCY")?.toIntOrNull() ?: 0
            } finally {
                track.release()
            }

            val result = Arguments.createMap()

            if (btDevice == null) {
                // Kein Bluetooth → Kabel oder interner Speaker → immer OK
                result.putBoolean("connected", false)
                result.putInt("latencyMs", latencyMs)
                result.putBoolean("blocked", false)
                result.putString("reason", "")
            } else {
                // Bluetooth verbunden: Latenz > 150ms = SBC/günstig → blockieren
                val blocked = latencyMs > 150
                val reason = if (blocked)
                    "Zu hohe Bluetooth-Latenz ($latencyMs ms erkannt).\n" +
                    "SBC-Bluetooth ist nicht für synchronen Betrieb geeignet.\n\n" +
                    "Bitte AUX-Kabel oder eine Box mit aptX / AAC / LDAC verwenden."
                else ""

                result.putBoolean("connected", true)
                result.putInt("latencyMs", latencyMs)
                result.putBoolean("blocked", blocked)
                result.putString("reason", reason)
            }

            promise.resolve(result)

        } catch (e: Exception) {
            promise.resolve(Arguments.createMap().apply {
                putBoolean("connected", false)
                putInt("latencyMs", 0)
                putBoolean("blocked", false)
                putString("reason", "")
            })
        }
    }
}
