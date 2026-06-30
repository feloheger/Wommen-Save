/**
 * Zustand Store – Geräte-Identität (ersetzt authStore.ts)
 */
import { create } from "zustand";

interface DeviceState {
  deviceId: string | null;
  expoPushToken: string | null;
  isLoading: boolean;
  isPremium: boolean;
  setDeviceId: (id: string | null) => void;
  setExpoPushToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setPremium: (isPremium: boolean) => void;
  reset: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceId: null,
  expoPushToken: null,
  isLoading: true,
  isPremium: false,
  setDeviceId: (deviceId) => set({ deviceId }),
  setExpoPushToken: (expoPushToken) => set({ expoPushToken }),
  setLoading: (isLoading) => set({ isLoading }),
  setPremium: (isPremium) => set({ isPremium }),
  reset: () => set({ deviceId: null, expoPushToken: null, isPremium: false }),
}));
