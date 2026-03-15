🌍 [Deutsch](README_DE.md) · [Nederlands](README_NL.md)

# 🎧 SyncParty

> Listen to music in sync with up to 30 people – offline, no streaming services, no account. Now with speaker box support.

SyncParty turns an Android phone into a DJ controller. Guests don't need to **install any app** – just scan the QR code, enter a name, plug in headphones or connect a speaker.

---

## ✨ Features

- 🎛️ **DJ Mode** – One person DJs, everyone else listens in sync
- 📱 **No app for guests** – Join directly in the browser via QR code
- 📶 **100% offline** – No internet needed, just a shared local WiFi
- 🎵 **Your own MP3s** – No streaming services, no ads
- 👥 **Up to 30 people** simultaneously (with a portable router)
- 🌈 **Immersive design** – Real-time visualizer, emoji reactions, party vibes
- 🔄 **Auto-sync** – Latecomers automatically jump to the current position
- 🔊 **Box Mode** – Connect phone to a speaker for a distributed sound system
- 🚫 **No cheap Bluetooth** – SBC is automatically blocked, only aptX / AAC / LDAC

---

## 📸 What it looks like

```
DJ Screen                          Guest Browser
┌──────────────────────┐           ┌──────────────────────┐
│ 🎛️ DJ Mode    📱 QR  │           │                      │
│ ● 24 guests connected│           │  ▁▃▅█▇▅▃▁▂▄▆█▇▅▂▁   │
│                      │           │                      │
│ ▶ 01 - Song1.mp3     │           │   Song1              │
│   02 - Song2.mp3     │  ──────►  │   ████████░░  2:34   │
│   03 - Song3.mp3     │           │                      │
│                      │           │  👥 24 listening     │
│  [⏮]  [⏸]  [⏭]     │           │  🔥 💃 😍 🎵 🙌      │
└──────────────────────┘           └──────────────────────┘
```

---

## 🔊 Box Mode

Each guest phone can be connected directly to a speaker box – creating a distributed, synchronized sound system without expensive hardware.

```
[DJ Phone]  ──── WiFi ────►  [Guest Phone 1] ──AUX/BT──► 🔊 Speaker 1
                             [Guest Phone 2] ──AUX/BT──► 🔊 Speaker 2
                             [Guest Phone 3] ──AUX/BT──► 🔊 Speaker 3
```

**Bluetooth Quality Check:**
When Box Mode is activated, the app automatically measures the audio output latency.

| Latency | Result | Example |
|---|---|---|
| < 150ms | ✅ Allowed | aptX, AAC, LDAC, AUX cable |
| > 150ms | ❌ Blocked | SBC (standard Bluetooth) |

**Offset slider:** If speakers still sound slightly out of sync, playback can be fine-tuned from −300ms to +300ms.

---

## 🛠️ What you need

| What | Why |
|---|---|
| Android phone (DJ) | Runs the app & server |
| Portable WiFi router | Recommended for 10+ guests (e.g. GL.iNet, ~€25) |
| Headphones or speaker | Each person listens on their own device |

- Android 7.0+ (DJ device)
- Any phone with a browser (guests)

---

## 🚀 Installation

### Step 1 – Download the APK

Go to [Releases](../../releases) and download the latest `SyncParty.apk`.

### Step 2 – Install the APK

1. Transfer the APK to your Android phone (USB, cloud, etc.)
2. On the phone: **Settings → Security → Unknown Sources** → allow
3. Tap the APK file → Install

### Step 3 – Add your MP3s

```
Internal Storage / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
```

The app creates the folder automatically on first launch.

### Step 4 – Start the party

**DJ phone:** Open app → "Become DJ" → Show QR code

**Guests (headphones):** Scan QR → Enter name → Join 🎧

**Guests (speaker):** Open app → "Join" → Enable Box Mode → Connect 🔊

---

## 📡 Network Setup (recommended for events)

```
[DJ Phone]
    │
    └── USB / WiFi ──► [Portable Router]
                              │
              ┌───────────────┼───────────────┐
           [Guest 1]      [Guest 2]  ...  [Guest 30]
```

**Recommended routers:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC (~€20–40).

---

## 🔧 Build it yourself (developers)

```bash
git clone https://github.com/MartialandFlow/SyncParty.git
cd SyncParty
npm install
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Use cases

- 🏕️ Camping & festivals – headphones or distributed speakers
- 🏖️ Beach parties – multiple speakers, one sync
- 🚌 Bus trips – silent disco for the whole group
- 🏠 House parties – speakers in different rooms
- 🌙 Silent disco – without expensive transmitter hardware

---

## ❓ FAQ

**Do guests need to install an app?**
For headphone mode no – just scan the QR and open the browser. For Box Mode the app is needed.

**Which Bluetooth works with Box Mode?**
aptX, aptX HD, AAC and LDAC. SBC is automatically blocked due to its high latency.

**How accurate is the sync?**
Around 20–50ms on the same WiFi – not noticeable in music.

**How many people can join?**
~10–15 with a phone hotspot, 30+ with a portable router.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License – do whatever you want with it.

---

<div align="center">
  <strong>Made with 🎧 for silent parties everywhere</strong>
</div>
