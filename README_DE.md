🌍 [English](README_EN.md) · [Nederlands](README_NL.md)

# 🎧 SyncParty

> Hör mit bis zu 30 Personen synchron Musik – offline, ohne Streaming-Dienste, ohne Account.

SyncParty verwandelt ein Android-Handy in einen DJ-Controller. Gäste müssen **keine App installieren** – einfach QR-Code scannen, Namen eingeben, Kopfhörer rein.

---

## ✨ Features

- 🎛️ **DJ-Mode** – Eine Person legt auf, alle anderen hören synchron mit
- 📱 **Keine App für Gäste** – Beitritt per QR-Code direkt im Browser
- 📶 **100% offline** – Funktioniert ohne Internet, nur lokales WLAN nötig
- 🎵 **Eigene MP3s** – Keine Streaming-Dienste, keine Werbung
- 👥 **Bis zu 30 Personen** gleichzeitig (mit portatiblem Router)
- 🌈 **Immersives Design** – Echtzeit-Visualizer, Emoji-Reaktionen, Party-Atmosphäre
- 🔄 **Auto-Sync** – Wer später dazukommt, springt automatisch an die richtige Position

---

## 📸 So sieht's aus

```
DJ-Screen                          Gast-Browser
┌──────────────────────┐           ┌──────────────────────┐
│ 🎛️ DJ Mode    📱 QR  │           │                      │
│ ● 24 Gäste verbunden │           │  ▁▃▅█▇▅▃▁▂▄▆█▇▅▂▁   │
│                      │           │                      │
│ ▶ 01 - Song1.mp3     │           │   Song1              │
│   02 - Song2.mp3     │  ──────►  │   ████████░░  2:34   │
│   03 - Song3.mp3     │           │                      │
│                      │           │  👥 24 hören mit     │
│  [⏮]  [⏸]  [⏭]     │           │  🔥 💃 😍 🎵 🙌      │
└──────────────────────┘           └──────────────────────┘
```

---

## 🛠️ Was du brauchst

### Hardware
| Was | Warum |
|---|---|
| Android-Handy (DJ) | Läuft die App & Server |
| Portabler WLAN-Router | Für mehr als ~10 Personen empfohlen (z.B. GL.iNet, ~25€) |
| Kopfhörer für alle | Jeder hört auf seinem Gerät |

### Software
- Android 7.0+ (DJ-Gerät)
- Jedes Handy mit Browser (Gäste)

---

## 🚀 Installation

### Schritt 1 – APK herunterladen

Geh zu [Releases](../../releases) und lade die neueste `SyncParty.apk` herunter.

### Schritt 2 – APK installieren

1. APK-Datei auf dein Android-Handy übertragen (USB, Cloud, etc.)
2. Auf dem Handy: **Einstellungen → Sicherheit → Unbekannte Quellen** erlauben
3. APK-Datei antippen → Installieren

> **Tipp:** Bei der Frage „Unbekannte App installieren" einfach erlauben – die App kommt nicht aus dem Play Store.

### Schritt 3 – MP3s vorbereiten

Auf dem **DJ-Handy** einen Ordner anlegen:

```
Interner Speicher / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
    03 - Song3.mp3
```

Die App legt den Ordner beim ersten Start automatisch an.

### Schritt 4 – Party starten

**DJ-Handy:**
1. SyncParty öffnen
2. „DJ werden" tippen
3. QR-Code anzeigen lassen (`📱 QR` Button)

**Gäste:**
1. Mit dem WLAN des Routers (oder DJ-Hotspot) verbinden
2. QR-Code mit der Kamera scannen
3. Namen eingeben → Beitreten
4. Kopfhörer rein 🎧

---

## 📡 Netzwerk-Setup (empfohlen für Events)

```
[DJ Handy]
    │
    └── USB / WiFi ──► [Portabler Router]
                              │
              ┌───────────────┼───────────────┐
           [Gast 1]       [Gast 2]  ...  [Gast 30]
```

**Empfohlene Router:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC oder ähnliche Travel-Router (~20–40€).

Alternativ funktioniert auch der **Hotspot des DJ-Handys** – allerdings sind dort meist nur 10–15 gleichzeitige Verbindungen möglich.

---

## 🔧 Selbst bauen (für Entwickler)

### Voraussetzungen

- Node.js 18+
- Android Studio (für SDK & JDK)
- Android SDK API 34+

### Setup

```bash
# Repo klonen
git clone https://github.com/dein-name/SyncParty.git
cd SyncParty

# Dependencies installieren
npm install

# Android APK bauen
cd android
./gradlew assembleDebug

# APK liegt dann unter:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Direkt auf Gerät installieren (USB)

```bash
# Gerät per USB anschließen, USB-Debugging aktivieren
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Anwendungsfälle

- 🏕️ Camping & Festivals – jeder hört mit dem eigenen Gerät
- 🏖️ Strandpartys – kein Lautsprecher nötig
- 🚌 Busreisen – stille Disco für die ganze Gruppe
- 🏠 Hauspartys – immersives Kopfhörer-Erlebnis
- 🌙 Silent Disco – ohne teure Sender-Hardware

---

## ❓ Häufige Fragen

**Brauchen Gäste die App installieren?**
Nein. Gäste öffnen die Party einfach im Browser – kein Download nötig.

**Funktioniert es ohne Internet?**
Ja, komplett offline. Nur ein gemeinsames WLAN (z.B. Hotspot oder Router) wird benötigt.

**Wie genau ist die Synchronisation?**
Im gleichen WLAN ca. 20–50ms Abweichung – bei Musik nicht wahrnehmbar.

**Welche Musikformate werden unterstützt?**
Aktuell MP3. Weitere Formate (AAC, FLAC) folgen.

**Wie viele Personen können mitmachen?**
Mit einem normalen Hotspot ~10–15, mit einem portablen Router bis zu 30+.

---

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue öffnen.

---

## 📄 Lizenz

MIT License – mach damit was du willst.

---

<div align="center">
  <strong>Made with 🎧 for silent parties everywhere</strong>
</div>