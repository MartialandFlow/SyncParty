🌍 [English](README_EN.md) · [Nederlands](README_NL.md)

# 🎧 SyncParty

> Hör mit bis zu 30 Personen synchron Musik – offline, ohne Streaming-Dienste, ohne Account. Jetzt auch mit Lautsprecher-Boxen.

SyncParty verwandelt ein Android-Handy in einen DJ-Controller. Gäste müssen **keine App installieren** – einfach QR-Code scannen, Namen eingeben, Kopfhörer oder Box rein.

---

## ✨ Features

- 🎛️ **DJ-Mode** – Eine Person legt auf, alle anderen hören synchron mit
- 📱 **Keine App für Gäste** – Beitritt per QR-Code direkt im Browser
- 📶 **100% offline** – Funktioniert ohne Internet, nur lokales WLAN nötig
- 🎵 **Eigene MP3s** – Keine Streaming-Dienste, keine Werbung
- 👥 **Bis zu 30 Personen** gleichzeitig (mit portatiblem Router)
- 🌈 **Immersives Design** – Echtzeit-Visualizer, Emoji-Reaktionen, Party-Atmosphäre
- 🔄 **Auto-Sync** – Wer später dazukommt, springt automatisch an die richtige Position
- 🔊 **Box-Modus** – Handy an Lautsprecher anschließen für verteiltes Sound-System
- 🚫 **Kein billiges Bluetooth** – SBC wird automatisch geblockt, nur aptX / AAC / LDAC

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

## 🔊 Box-Modus

Jedes Gast-Handy kann direkt an eine Lautsprecher-Box angeschlossen werden – so entsteht ein verteiltes, synchrones Sound-System ohne teure Hardware.

```
[DJ Handy]  ──── WLAN ────►  [Gast-Handy 1] ──AUX/BT──► 🔊 Box 1
                             [Gast-Handy 2] ──AUX/BT──► 🔊 Box 2
                             [Gast-Handy 3] ──AUX/BT──► 🔊 Box 3
```

**Bluetooth-Qualitäts-Check:**
Beim Aktivieren des Box-Modus misst die App automatisch die Ausgangslatenz.

| Latenz | Bewertung | Beispiel |
|---|---|---|
| < 150ms | ✅ Erlaubt | aptX, AAC, LDAC, AUX |
| > 150ms | ❌ Geblockt | SBC (Standard Bluetooth) |

**Offset-Regler:** Falls Boxen trotzdem leicht versetzt klingen, lässt sich die Wiedergabe per Schieberegler von −300ms bis +300ms feinabstimmen.

---

## 🛠️ Was du brauchst

| Was | Warum |
|---|---|
| Android-Handy (DJ) | Läuft die App & Server |
| Portabler WLAN-Router | Für mehr als ~10 Personen empfohlen (z.B. GL.iNet, ~25€) |
| Kopfhörer oder Box | Jeder hört auf seinem Gerät |

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

### Schritt 3 – MP3s vorbereiten

```
Interner Speicher / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
```

Die App legt den Ordner beim ersten Start automatisch an.

### Schritt 4 – Party starten

**DJ-Handy:** App öffnen → „DJ werden" → QR-Code zeigen

**Gäste (Kopfhörer):** QR scannen → Namen eingeben → Beitreten 🎧

**Gäste (Box):** App öffnen → „Mithören" → Box-Modus aktivieren → Verbinden 🔊

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

**Empfohlene Router:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC (~20–40€).

---

## 🔧 Selbst bauen (für Entwickler)

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

## 🎯 Anwendungsfälle

- 🏕️ Camping & Festivals – Kopfhörer oder verteilte Boxen
- 🏖️ Strandpartys – mehrere Boxen, ein Sync
- 🚌 Busreisen – stille Disco für die ganze Gruppe
- 🏠 Hauspartys – Boxen in verschiedenen Räumen
- 🌙 Silent Disco – ohne teure Sender-Hardware

---

## ❓ Häufige Fragen

**Brauchen Gäste die App installieren?**
Für Kopfhörer-Modus nein – einfach QR scannen und Browser öffnen. Für Box-Modus wird die App benötigt.

**Welches Bluetooth funktioniert mit dem Box-Modus?**
aptX, aptX HD, AAC und LDAC. SBC wird automatisch geblockt, da die Latenz zu hoch ist.

**Wie genau ist die Synchronisation?**
Ca. 20–50ms im gleichen WLAN – bei Musik nicht wahrnehmbar.

**Wie viele Personen können mitmachen?**
~10–15 mit einem Hotspot, 30+ mit einem portablen Router.

---

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue öffnen.

## 📄 Lizenz

MIT License – mach damit was du willst.

---

<div align="center">
  <strong>Made with 🎧 for silent parties everywhere</strong>
</div>
