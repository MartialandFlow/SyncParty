🎧 SyncParty

> Listen to music in sync with up to 30 people – offline, no streaming services, no account needed.

SyncParty turns an Android phone into a DJ controller. Guests don't need to **install any app** – just scan the QR code, enter a name, plug in headphones.

---

## ✨ Features

- 🎛️ **DJ Mode** – One person DJs, everyone else listens in sync
- 📱 **No app for guests** – Join directly in the browser via QR code
- 📶 **100% offline** – No internet needed, just a shared local WiFi
- 🎵 **Your own MP3s** – No streaming services, no ads
- 👥 **Up to 30 people** simultaneously (with a portable router)
- 🌈 **Immersive design** – Real-time visualizer, emoji reactions, party vibes
- 🔄 **Auto-sync** – Latecomers automatically jump to the current position

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

## 🛠️ What you need

| What | Why |
|---|---|
| Android phone (DJ) | Runs the app & server |
| Portable WiFi router | Recommended for 10+ guests (e.g. GL.iNet, ~€25) |
| Headphones for everyone | Each person listens on their own device |

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

> **Tip:** When prompted about installing from unknown sources, just allow it – the app isn't from the Play Store.

### Step 3 – Add your MP3s

On the **DJ phone**, place your files here:

```
Internal Storage / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
    03 - Song3.mp3
```

The app creates the folder automatically on first launch.

### Step 4 – Start the party

**DJ phone:**
1. Open SyncParty
2. Tap "Become DJ"
3. Show the QR code (`📱 QR` button)

**Guests:**
1. Connect to the router's WiFi (or DJ hotspot)
2. Scan the QR code with the camera
3. Enter name → Join
4. Plug in headphones 🎧

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

**Recommended routers:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC or similar travel routers (~€20–40).

The **DJ phone's hotspot** also works – but usually supports only 10–15 simultaneous connections.

---

## 🔧 Build it yourself (developers)

### Requirements

- Node.js 18+
- Android Studio (for SDK & JDK)
- Android SDK API 34+

### Setup

```bash
git clone https://github.com/your-name/SyncParty.git
cd SyncParty
npm install
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### Install via USB

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Use cases

- 🏕️ Camping & festivals – everyone listens on their own device
- 🏖️ Beach parties – no speaker needed
- 🚌 Bus trips – silent disco for the whole group
- 🏠 House parties – immersive headphone experience
- 🌙 Silent disco – without expensive transmitter hardware

---

## ❓ FAQ

**Do guests need to install an app?**
No. Guests join directly in the browser – no download needed.

**Does it work without internet?**
Yes, fully offline. Only a shared WiFi (hotspot or router) is required.

**How accurate is the sync?**
Around 20–50ms on the same WiFi – not noticeable in music.

**Which audio formats are supported?**
Currently MP3. More formats (AAC, FLAC) coming soon.

**How many people can join?**
~10–15 with a phone hotspot, 30+ with a portable router.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License – do whatever you want with it.
