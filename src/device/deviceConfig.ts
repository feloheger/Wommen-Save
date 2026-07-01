/**
 * Geräte-Identität & Push-Initialisierung
 * Ersetzt firebaseConfig.ts – es wird kein Firebase mehr benötigt.
 *
 * Identität besteht aus zwei Werten:
 *  - deviceId: stabile, lokal generierte UUID (persistiert in SecureStore)
 *  - expoPushToken: von Expo vergebenes Push-Token (für Benachrichtigungen)
 */
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "flowos_device_id";

/**
 * Erzeugt eine simple v4-UUID ohne externe Abhängigkeit.
 */
const generateUuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Liefert die stabile Geräte-ID. Wird beim ersten Aufruf erzeugt
 * und danach dauerhaft in SecureStore gespeichert.
 */
export const getDeviceId = async (): Promise<string> => {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existing) return existing;

  const newId = generateUuid();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, newId);
  return newId;
};

/**
 * Fordert die Push-Benachrichtigungs-Berechtigung an und liefert
 * das Expo Push Token zurück. Gibt null zurück, wenn keine
 * Berechtigung erteilt wurde oder es sich um einen Emulator handelt.
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  if (!Constants.isDevice && Platform.OS !== "web") {
    // Push-Token funktioniert nicht zuverlässig auf Emulatoren
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("FlowOS: Kein EAS projectId in app.json gefunden – Push-Token kann nicht abgerufen werden.");
    return null;
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenResponse.data;
};

/**
 * Bündelt Geräte-ID und Push-Token zu einer kompletten Identität,
 * z. B. zum Senden an ein eigenes Backend.
 */
export const getDeviceIdentity = async () => {
  const [deviceId, expoPushToken] = await Promise.all([getDeviceId(), getExpoPushToken()]);
  return { deviceId, expoPushToken };
};
