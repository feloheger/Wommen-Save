/**
 * Zustand Store – App-Einstellungen (persistiert via SecureStore)
 */
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface SettingsState {
  darkMode: boolean;
  language: "de" | "en";
  notificationsEnabled: boolean;
  setDarkMode: (value: boolean) => void;
  setLanguage: (lang: "de" | "en") => void;
  setNotificationsEnabled: (value: boolean) => void;
  hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  darkMode: false,
  language: "de",
  notificationsEnabled: true,
  setDarkMode: (value) => {
    set({ darkMode: value });
    SecureStore.setItemAsync("darkMode", JSON.stringify(value)).catch(() => {});
  },
  setLanguage: (lang) => {
    set({ language: lang });
    SecureStore.setItemAsync("language", lang).catch(() => {});
  },
  setNotificationsEnabled: (value) => {
    set({ notificationsEnabled: value });
    SecureStore.setItemAsync("notificationsEnabled", JSON.stringify(value)).catch(() => {});
  },
  hydrate: async () => {
    const [darkMode, language, notificationsEnabled] = await Promise.all([
      SecureStore.getItemAsync("darkMode"),
      SecureStore.getItemAsync("language"),
      SecureStore.getItemAsync("notificationsEnabled"),
    ]);
    set({
      darkMode: darkMode ? JSON.parse(darkMode) : false,
      language: (language as "de" | "en") ?? "de",
      notificationsEnabled: notificationsEnabled ? JSON.parse(notificationsEnabled) : true,
    });
    void get; // keep get referenced for future use
  },
}));
