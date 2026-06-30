/**
 * Firebase Initialisierung
 * Werte werden aus Umgebungsvariablen geladen (siehe .env.example)
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
// In Firebase v11 liegt getReactNativePersistence genau hier:
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// App initialisieren (stellt sicher, dass sie nur einmal initialisiert wird)
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth mit persistenter Session via AsyncStorage (Korrekt für Firebase v11 + Expo v52)
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(firebaseApp);

// Cloud Messaging ist nur auf unterstützten Plattformen verfügbar
export const getFcm = async () => {
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  return getMessaging(firebaseApp);
};

export const isExpoGo = Constants.appOwnership === "expo";
