# 🛡️ Women Save

Sicherheits-App für mehr Schutz und Selbstbestimmung im Alltag – gebaut mit **Expo SDK 52**, **React Native** und **TypeScript**.
Kein Konto nötig: Alle Daten (Vertrauenspersonen, markierte Gefahrenzonen, Einstellungen) bleiben auf dem Gerät.

## Screens

| Bereich           | Inhalt                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Willkommen        | Splash mit „Los geht's“                                                                           |
| Home              | SOS-Panik-Modus, Standort teilen, Self-Care, Fake Call, Sicherheitstipps                          |
| Karte             | Sichere Orte (Polizei, Apotheke, Krankenhaus; OpenStreetMap), eigene Gefahrenzonen per Long-Press |
| Kontakte          | Vertrauenspersonen (anrufen, bearbeiten, Favorit, löschen), Hilfsnummern                          |
| Mehr / Funktionen | Notruf 112, Safe-Journey-Modus, Alarm, Sicherheitswarnungen, Smartwatch (bald)                    |
| Sicherheitstipps  | Alltag, Gefahrensituationen, Hilfsnummern, Anlaufstellen, Wissenswertes                           |
| Premium           | Vergleich Kostenlos / Premium                                                                     |

## Wichtig zu wissen

- **SOS** zeigt einen 5-Sekunden-Countdown (Abbruch möglich) und öffnet dann die SMS-App mit Standort-Link. Apps dürfen SMS nicht still senden – die Person muss „Senden“ tippen. Zusätzlich gibt es einen „112 anrufen“-Button.
- **Premium**: Es ist noch kein Zahlungsanbieter angebunden. In Release-Builds wird kein Premium vergeben.
- **Karte unter Android** braucht einen Google-Maps-API-Key (`GOOGLE_MAPS_API_KEY`, siehe `.env.example`).

## Entwicklung

```bash
npm install --legacy-peer-deps
cp .env.example .env     # Maps-Key eintragen (Android)
npx expo start
```

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint + Prettier
npm run test        # Jest
```

Pfad-Alias: `@/…` → `src/…`.

## Build (EAS)

```bash
npm install -g eas-cli && eas login
eas build --platform android --profile preview   # APK
eas build --platform ios --profile production
```

Für `eas submit` (iOS) in `eas.json` unter `submit.production.ios` `appleId`, `ascAppId`, `appleTeamId` eintragen.

## Projektstruktur

```
app/            Expo-Router-Routen (dünne Wrapper)
src/screens/    Screen-Implementierungen
src/components/ Screen, Card, Button, Input, ListRow, Logo
src/services/   Standort, SMS, Benachrichtigungen, SOS, Safe Journey, Orte
src/store/      Zustand-Stores (persistiert via AsyncStorage)
src/data/       Tipps & Hilfsnummern
src/theme/      Farben, Schrift, Radien
__tests__/      Jest-Tests
```

## Lizenz

MIT – siehe [LICENSE](LICENSE)
