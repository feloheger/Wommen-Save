/**
 * Einstellungen & Premium-Status – persistiert in AsyncStorage
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
  hasOnboarded: boolean;
  notificationsEnabled: boolean;
  isPremium: boolean;
  completeOnboarding: () => void;
  setNotificationsEnabled: (value: boolean) => void;
  setPremium: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      notificationsEnabled: true,
      isPremium: false,
      completeOnboarding: () => set({ hasOnboarded: true }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setPremium: (isPremium) => set({ isPremium }),
    }),
    { name: "ws-settings", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
