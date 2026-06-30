/**
 * Zustand Store – Premium Status
 */
import { create } from "zustand";

interface PremiumState {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
}

export const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false,
  setPremium: (value) => set({ isPremium: value }),
}));
