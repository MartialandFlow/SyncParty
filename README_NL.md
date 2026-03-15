🌍 [Deutsch](README_DE.md) · [English](README_EN.md)

# 🎧 SyncParty

> Luister samen met maximaal 30 mensen naar muziek – offline, zonder streamingdiensten, zonder account.

SyncParty maakt van een Android-telefoon een DJ-controller. Gasten hoeven **geen app te installeren** – scan gewoon de QR-code, voer een naam in en stop de oortjes in.

---

## ✨ Functies

- 🎛️ **DJ-modus** – Één persoon draait, iedereen luistert synchroon mee
- 📱 **Geen app voor gasten** – Deelnemen via QR-code direct in de browser
- 📶 **100% offline** – Geen internet nodig, alleen een gedeeld lokaal wifi
- 🎵 **Eigen MP3's** – Geen streamingdiensten, geen reclame
- 👥 **Tot 30 personen** tegelijk (met een draagbare router)
- 🌈 **Meeslepend design** – Realtime visualizer, emoji-reacties, feestsfeer
- 🔄 **Auto-sync** – Wie later aansluit, springt automatisch naar de juiste positie

---

## 📸 Hoe het eruitziet

```
DJ-scherm                          Browser van gast
┌──────────────────────┐           ┌──────────────────────┐
│ 🎛️ DJ Mode    📱 QR  │           │                      │
│ ● 24 gasten verbonden│           │  ▁▃▅█▇▅▃▁▂▄▆█▇▅▂▁   │
│                      │           │                      │
│ ▶ 01 - Song1.mp3     │           │   Song1              │
│   02 - Song2.mp3     │  ──────►  │   ████████░░  2:34   │
│   03 - Song3.mp3     │           │                      │
│                      │           │  👥 24 luisteren mee │
│  [⏮]  [⏸]  [⏭]     │           │  🔥 💃 😍 🎵 🙌      │
└──────────────────────┘           └──────────────────────┘
```

---

## 🛠️ Wat je nodig hebt

| Wat | Waarom |
|---|---|
| Android-telefoon (DJ) | Draait de app & server |
| Draagbare wifi-router | Aanbevolen voor 10+ gasten (bijv. GL.iNet, ~€25) |
| Oortjes voor iedereen | Iedereen luistert op zijn eigen apparaat |

- Android 7.0+ (DJ-apparaat)
- Elke telefoon met een browser (gasten)

---

## 🚀 Installatie

### Stap 1 – Download de APK

Ga naar [Releases](../../releases) en download de nieuwste `SyncParty.apk`.

### Stap 2 – Installeer de APK

1. Zet het APK-bestand op je Android-telefoon (USB, cloud, etc.)
2. Op de telefoon: **Instellingen → Beveiliging → Onbekende bronnen** → toestaan
3. Tik op het APK-bestand → Installeren

> **Tip:** Als gevraagd wordt of je wilt installeren vanuit onbekende bronnen, sta dit gewoon toe – de app staat niet in de Play Store.

### Stap 3 – MP3's klaarzetten

Zet je bestanden op de **DJ-telefoon** in deze map:

```
Interne opslag / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
    03 - Song3.mp3
```

De app maakt de map automatisch aan bij de eerste start.

### Stap 4 – Feest starten

**DJ-telefoon:**
1. Open SyncParty
2. Tik op "DJ worden"
3. Toon de QR-code (knop `📱 QR`)

**Gasten:**
1. Verbind met het wifi van de router (of de hotspot van de DJ)
2. Scan de QR-code met de camera
3. Naam invoeren → Deelnemen
4. Oortjes in 🎧

---

## 📡 Netwerk-setup (aanbevolen voor evenementen)

```
[DJ-telefoon]
    │
    └── USB / WiFi ──► [Draagbare router]
                              │
              ┌───────────────┼───────────────┐
           [Gast 1]       [Gast 2]  ...  [Gast 30]
```

**Aanbevolen routers:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC of vergelijkbare reisrouters (~€20–40).

De **hotspot van de DJ-telefoon** werkt ook – maar ondersteunt doorgaans slechts 10–15 gelijktijdige verbindingen.

---

## 🔧 Zelf bouwen (voor ontwikkelaars)

### Vereisten

- Node.js 18+
- Android Studio (voor SDK & JDK)
- Android SDK API 34+

### Setup

```bash
git clone https://github.com/jouw-naam/SyncParty.git
cd SyncParty
npm install
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### Installeren via USB

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Gebruikssituaties

- 🏕️ Camping & festivals – iedereen luistert op zijn eigen apparaat
- 🏖️ Strandfeesten – geen luidspreker nodig
- 🚌 Busreizen – stille disco voor de hele groep
- 🏠 Huisfeesten – meeslepende koptelefoonervaring
- 🌙 Silent disco – zonder dure zenderhardware

---

## ❓ Veelgestelde vragen

**Moeten gasten een app installeren?**
Nee. Gasten nemen deel via de browser – geen download nodig.

**Werkt het zonder internet?**
Ja, volledig offline. Alleen een gedeeld wifi (hotspot of router) is nodig.

**Hoe nauwkeurig is de synchronisatie?**
Ongeveer 20–50ms op hetzelfde wifi – niet hoorbaar in muziek.

**Welke audioformaten worden ondersteund?**
Momenteel MP3. Meer formaten (AAC, FLAC) komen binnenkort.

**Hoeveel mensen kunnen meedoen?**
~10–15 met een telefoon-hotspot, 30+ met een draagbare router.

---

## 🤝 Bijdragen

Pull requests zijn welkom! Voor grote wijzigingen eerst een issue aanmaken.

## 📄 Licentie

MIT-licentie – doe er mee wat je wilt.

---

<div align="center">
  <strong>Made with 🎧 for silent parties everywhere</strong>
</div>