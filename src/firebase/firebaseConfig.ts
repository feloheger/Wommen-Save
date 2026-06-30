/**
 * Firebase Initialisierung
 * Werte werden aus Umgebungsvariablen geladen (siehe .env.example)
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getUnderlyingProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

import Constants from "expo-constants";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth mit persistenter Session via AsyncStorage (React Native)
export const auth = initializeAuth(app, {
  persistence: (AsyncStorage as any)
});
export const firestore = getFirestore(firebaseApp);

// Cloud Messaging ist nur auf unterstützten Plattformen verfügbar
export const getFcm = async () => {
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  return getMessaging(firebaseApp);
};

export const isExpoGo = Constants.appOwnership === "expo";
