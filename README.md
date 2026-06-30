# 🛡️ Women Save

Eine moderne Sicherheits-App für mehr Schutz und Selbstbestimmung im Alltag von Frauen.
Gebaut mit **React Native**, **Expo** und **TypeScript** im Premium-Design.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-7C5CFC)
![License](https://img.shields.io/badge/license-MIT-B79CFF)
![Expo SDK](https://img.shields.io/badge/Expo-SDK%2052-7C5CFC)

---

## ✨ Features

| Feature | Beschreibung |
|---|---|
| 🆘 **SOS** | Ein Tippen genügt: Standort wird abgerufen, eine Nachricht erstellt und an Vertrauenspersonen per SMS gesendet, inklusive Vibrationsalarm. |
| 🚶‍♀️ **Safe Walk** | Live-Tracking auf dem Heimweg mit Timer. Erfolgt keine Bestätigung, wird automatisch ein SOS ausgelöst. |
| 👥 **Vertrauenspersonen** | Hinzufügen, Bearbeiten, Löschen und Favorisieren von Kontakten, die im Notfall benachrichtigt werden. |
| 📞 **Fake Call** | Realistisch simulierter Anruf von Mama, einer Freundin oder einem frei wählbaren Namen, mit einstellbarem Timer. |
| 🔊 **Alarm** | Lauter Sirenen-Alarm mit blinkendem Bildschirm und Dauervibration. |
| 👑 **Premium** | Unbegrenzte Kontakte, Safe Walk+, automatische Gefahrenzonen-Erkennung, Familiengruppe, Cloud Backup und exklusive Themes. |
| ⚙️ **Einstellungen** | Dark Mode, Sprache, Datenschutz, Benachrichtigungen, Kontoverwaltung und Support. |

---

## 🎨 Design

- **Primärfarbe:** `#7C5CFC`
- **Sekundärfarbe:** `#B79CFF`
- **Hintergrund:** `#FFFFFF`
- **Akzent:** `#F3EEFF`
- **Schrift:** Poppins
- **Icons:** Lucide
- Minimalistisches Premium-Design mit Glassmorphism, sanften Schatten, Gradients und Microinteractions (React Native Reanimated + Expo Haptics).

---

## 🧱 Tech Stack

- **Expo SDK 52** (managed workflow) + **Expo Router** (file-based navigation)
- **TypeScript** (strict mode)
- **NativeWind** (Tailwind CSS für React Native)
- **Zustand** für globalen Client-State
- **TanStack React Query** für serverseitigen State
- **Firebase** (Authentication, Firestore, Cloud Messaging)
- **React Hook Form + Zod** für typsichere Formularvalidierung
- **React Native Reanimated** & **Expo Haptics** für Animationen & Feedback
- **React Native Maps**, **Expo Location**, **Expo Contacts**, **Expo Notifications**, **Expo Secure Store**

---

## 📁 Projektstruktur

```
women-save/
├── app/                    # Expo Router – Datei-basierte Navigation
│   ├── (auth)/             # Login, Register, Passwort vergessen, Verifizierung
│   ├── (tabs)/             # Home, Kontakte, Einstellungen
│   ├── sos.tsx
│   ├── safe-walk.tsx
│   ├── fake-call.tsx
│   ├── alarm.tsx
│   └── premium.tsx
├── src/
│   ├── components/         # UI-, Card- und Common-Komponenten
│   ├── screens/             # Eigentliche Screen-Implementierungen
│   ├── hooks/                # useSos, useSafeWalk, useFakeCall, useAlarm, useAuth ...
│   ├── services/             # Standort, SMS, Notifications, Contacts
│   ├── firebase/              # Firebase Config, Auth- & Firestore-Services
│   ├── store/                  # Zustand Stores
│   ├── constants/               # Farben & globale Konfiguration
│   ├── types/                    # Globale TypeScript-Typen
│   └── utils/                     # Validierung (Zod) & Formatter
├── __tests__/                      # Jest + React Native Testing Library
├── .github/workflows/                # CI/CD Pipelines
└── assets/
```

---

## 🚀 Erste Schritte

### Voraussetzungen
- Node.js ≥ 18
- npm oder yarn
- Expo CLI (`npm install -g expo-cli`, optional – `npx expo` funktioniert ohne globale Installation)
- Ein Firebase-Projekt mit aktivierter Authentication & Firestore

### Installation

```bash
git clone https://github.com/<your-org>/women-save.git
cd women-save
npm install
cp .env.example .env
# .env mit deinen Firebase-Zugangsdaten befüllen
npx expo start
```

### Build (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

### 🍎 Apple / iOS Build & Submit

Die Datei [`eas.json`](./eas.json) enthält fertige Build-Profile (`development`, `preview`, `production`) sowie eine `submit`-Konfiguration für den Apple App Store.

```bash
# iOS Build (Production, App Store)
eas build --platform ios --profile production

# iOS Build (Simulator, zum lokalen Testen)
eas build --platform ios --profile development

# An den App Store übermitteln (benötigt Apple Developer Account)
eas submit --platform ios --latest
```

In `eas.json` unter `submit.production.ios` müssen vor dem Submit folgende Werte ersetzt werden:
- `appleId` – deine Apple-ID (E-Mail)
- `ascAppId` – App Store Connect App-ID
- `appleTeamId` – dein Apple Developer Team-ID

Diese Werte findest du in [App Store Connect](https://appstoreconnect.apple.com) unter "App Information".

### ⚙️ Automatische Installation via GitHub Actions

Der Workflow [`.github/workflows/install.yml`](./.github/workflows/install.yml) läuft bei jedem Push/PR automatisch:
1. `npm ci` – installiert alle Abhängigkeiten exakt nach `package-lock.json`
2. `npx expo install --fix` – korrigiert automatisch inkompatible Paketversionen passend zum verwendeten Expo SDK
3. `npx expo-doctor` – prüft das Projekt auf typische Konfigurationsfehler

Alle weiteren Workflows (`ci.yml`, `expo-build.yml`, `preview.yml`) führen denselben Fix-Schritt vor dem eigentlichen Job aus, sodass Builds nie an veralteten Paketversionen scheitern. Auch lokal wird dieser Fix automatisch nach jedem `npm install` über das `postinstall`-Script ausgeführt.

---

## 🧪 Qualitätssicherung

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run format      # Prettier
npm run test        # Jest + RNTL
```

Husky + Commitlint stellen sicher, dass Commits dem [Conventional Commits](https://www.conventionalcommits.org/) Standard folgen.

---

## 🤝 Contributing

1. Branch von `main` erstellen
2. Änderungen mit Conventional Commits committen (`feat:`, `fix:`, `chore:`, …)
3. Pull Request öffnen – CI prüft automatisch Lint, Typecheck und Tests

---

## 📄 Lizenz

MIT – siehe [LICENSE](./LICENSE)

---

<p align="center">Gebaut mit 💜 für mehr Sicherheit im Alltag.</p>
