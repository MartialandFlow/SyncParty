🌍 [Deutsch](README_DE.md) · [English](README_EN.md)

# 🎧 SyncParty

> Luister samen met maximaal 30 mensen naar muziek – offline, zonder streamingdiensten, zonder account. Nu ook met luidsprekersupport.

SyncParty maakt van een Android-telefoon een DJ-controller. Gasten hoeven **geen app te installeren** – scan de QR-code, voer een naam in en stop de oortjes in of verbind een luidspreker.

---

## ✨ Functies

- 🎛️ **DJ-modus** – Één persoon draait, iedereen luistert synchroon mee
- 📱 **Geen app voor gasten** – Deelnemen via QR-code direct in de browser
- 📶 **100% offline** – Geen internet nodig, alleen een gedeeld lokaal wifi
- 🎵 **Eigen MP3's** – Geen streamingdiensten, geen reclame
- 👥 **Tot 30 personen** tegelijk (met een draagbare router)
- 🌈 **Meeslepend design** – Realtime visualizer, emoji-reacties, feestsfeer
- 🔄 **Auto-sync** – Wie later aansluit, springt automatisch naar de juiste positie
- 🔊 **Box-modus** – Telefoon aansluiten op een luidspreker voor verdeeld geluidssysteem
- 🚫 **Geen goedkope Bluetooth** – SBC wordt automatisch geblokkeerd, alleen aptX / AAC / LDAC

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

## 🔊 Box-modus

Elke gasttelefooon kan direct worden aangesloten op een luidspreker – zo ontstaat een verdeeld, synchroon geluidssysteem zonder dure hardware.

```
[DJ-telefoon]  ──── WiFi ────►  [Gast 1] ──AUX/BT──► 🔊 Box 1
                                [Gast 2] ──AUX/BT──► 🔊 Box 2
                                [Gast 3] ──AUX/BT──► 🔊 Box 3
```

**Bluetooth-kwaliteitscheck:**
Bij het inschakelen van de box-modus meet de app automatisch de audio-uitvoerlatentie.

| Latentie | Resultaat | Voorbeeld |
|---|---|---|
| < 150ms | ✅ Toegestaan | aptX, AAC, LDAC, AUX-kabel |
| > 150ms | ❌ Geblokkeerd | SBC (standaard Bluetooth) |

**Offset-schuifregelaar:** Als boxen toch iets uit de maat klinken, kan de weergave worden bijgesteld van −300ms tot +300ms.

---

## 🛠️ Wat je nodig hebt

| Wat | Waarom |
|---|---|
| Android-telefoon (DJ) | Draait de app & server |
| Draagbare wifi-router | Aanbevolen voor 10+ gasten (bijv. GL.iNet, ~€25) |
| Oortjes of luidspreker | Iedereen luistert op zijn eigen apparaat |

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

### Stap 3 – MP3's klaarzetten

```
Interne opslag / SyncParty /
    01 - Song1.mp3
    02 - Song2.mp3
```

De app maakt de map automatisch aan bij de eerste start.

### Stap 4 – Feest starten

**DJ-telefoon:** App openen → "DJ worden" → QR-code tonen

**Gasten (oortjes):** QR scannen → Naam invoeren → Deelnemen 🎧

**Gasten (box):** App openen → "Meeluisteren" → Box-modus inschakelen → Verbinden 🔊

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

**Aanbevolen routers:** GL.iNet GL-MT300N-V2, TP-Link TL-WR902AC (~€20–40).

---

## 🔧 Zelf bouwen (ontwikkelaars)

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

## 🎯 Gebruikssituaties

- 🏕️ Camping & festivals – oortjes of verspreide boxen
- 🏖️ Strandfeesten – meerdere boxen, één sync
- 🚌 Busreizen – stille disco voor de hele groep
- 🏠 Huisfeesten – boxen in verschillende kamers
- 🌙 Silent disco – zonder dure zenderhardware

---

## ❓ Veelgestelde vragen

**Moeten gasten een app installeren?**
Voor oortjes-modus niet – gewoon QR scannen en browser openen. Voor box-modus is de app nodig.

**Welke Bluetooth werkt met box-modus?**
aptX, aptX HD, AAC en LDAC. SBC wordt automatisch geblokkeerd vanwege de hoge latentie.

**Hoe nauwkeurig is de synchronisatie?**
Ongeveer 20–50ms op hetzelfde wifi – niet hoorbaar in muziek.

**Hoeveel mensen kunnen meedoen?**
~10–15 met een hotspot, 30+ met een draagbare router.

---

## 🤝 Bijdragen

Pull requests zijn welkom! Voor grote wijzigingen eerst een issue aanmaken.

## 📄 Licentie

MIT-licentie – doe er mee wat je wilt.

---

<div align="center">
  <strong>Made with 🎧 for silent parties everywhere</strong>
</div>
