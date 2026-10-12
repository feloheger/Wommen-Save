/**
 * Lokale Benachrichtigungen (kein Push-Backend nötig)
 */
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { useSettingsStore } from "@/store/settingsStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let channelReady = false;

export const ensureNotificationSetup = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "android" && !channelReady) {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Women Save",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#8B3A62",
      });
      channelReady = true;
    }
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
};

export const showNow = async (title: string, body: string): Promise<void> => {
  try {
    if (!useSettingsStore.getState().notificationsEnabled) return;
    if (!(await ensureNotificationSetup())) return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
  } catch {
    /* Benachrichtigung ist nur ein Zusatz – nie den Ablauf blockieren */
  }
};

/** Plant eine Benachrichtigung für einen Zeitpunkt; gibt die ID zum Abbrechen zurück. */
export const scheduleAt = async (title: string, body: string, at: Date): Promise<string | null> => {
  try {
    if (!useSettingsStore.getState().notificationsEnabled) return null;
    if (!(await ensureNotificationSetup())) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
    });
  } catch {
    return null;
  }
};

export const cancelScheduled = async (id: string | null): Promise<void> => {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    /* ignorieren */
  }
};
