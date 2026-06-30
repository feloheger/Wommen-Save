# Women Save – Migration: Firebase → Device-ID + Expo Push Token

Dieses ZIP enthält die Dateien, die du in deinem `Wommen-Save`-Repo
ersetzen bzw. hinzufügen musst, um (so wie bei FlowOS) auf eine reine
Geräte-Identität ohne Login/Firebase umzustellen. Design, Farben und
alle Features (SOS, Safe Walk, Fake Call, Alarm, Premium, Einstellungen)
bleiben unverändert.

## 1. Dateien LÖSCHEN

```
src/firebase/                  (kompletter Ordner)
app/(auth)/                    (kompletter Ordner – Login/Register/etc.)
```

## 2. Dateien HINZUFÜGEN (aus diesem ZIP)

```
src/device/deviceConfig.ts     -> neu, ersetzt src/firebase/firebaseConfig.ts
src/device/deviceService.ts    -> neu, ersetzt src/firebase/authService.ts
src/store/deviceStore.ts       -> neu, ersetzt src/store/authStore.ts
src/hooks/useDevice.ts         -> neu, ersetzt src/hooks/useAuth.ts
app/_layout.tsx                -> ERSETZT die bestehende Datei
.env.example                   -> ERSETZT die bestehende Datei
```

## 3. Weitere Anpassungen, die DU manuell machen musst

### a) `src/types/index.ts`
`UserProfile`-Interface entfernen (oder stark vereinfachen), da kein
Profil mehr existiert. Andere Typen wie `SosEvent.userId` ggf. auf
`deviceId: string` umbenennen.

### b) Alle Stellen, die `useAuth` importieren
Suche im ganzen Projekt nach `@hooks/useAuth` bzw. `useAuthStore` und
ersetze sie durch `@hooks/useDevice` bzw. `useDeviceStore`:

```bash
grep -rl "useAuth\|authStore" src app
```

Betroffen sind voraussichtlich:
- `app/(tabs)/*` (z. B. Profil-Anzeige, Premium-Status)
- `src/screens/*` (falls dort `user.name`, `user.email` o. Ä. angezeigt wird)
- `src/services/*` (falls Firestore-Aufrufe für Premium/Profil genutzt werden)

### c) `src/firebase/firestoreService.ts`
Falls hier Kontakte/SOS-Events in Firestore gespeichert werden, musst
du diese Calls entweder entfernen (rein lokal mit Zustand + AsyncStorage)
oder durch eigene Backend-Calls (`fetch`) ersetzen, die `deviceId` statt
`uid` verwenden.

### d) `package.json`
Entfernen:
```json
"firebase": "^11.0.2"
```
Sicherstellen, dass vorhanden sind (meist schon installiert):
```bash
npx expo install expo-secure-store expo-notifications expo-constants expo-device
```

### e) `app.json`
Keine Firebase-Plugins vorhanden (gut) – nichts zu tun. `extra.eas.projectId`
muss für `getExpoPushTokenAsync()` korrekt gesetzt sein (per `eas init`).

## 4. Danach testen

```bash
npm install
npx expo start
```

Beim App-Start sollte jetzt keine Login-Maske mehr erscheinen, sondern
direkt die App – im Hintergrund wird automatisch eine Device-ID erzeugt
und das Push-Token abgerufen (Berechtigungsdialog erscheint einmalig).
