/**
 * Zustand Store – SOS Status
 */
import { create } from "zustand";
import type { SosStatus, LocationPoint } from "@types/index";

interface SosState {
  status: SosStatus;
  location: LocationPoint | null;
  triggeredAt: number | null;
  triggerSos: (location: LocationPoint | null) => void;
  resolveSos: () => void;
  reset: () => void;
}

export const useSosStore = create<SosState>((set) => ({
  status: "idle",
  location: null,
  triggeredAt: null,
  triggerSos: (location) =>
    set({ status: "triggered", location, triggeredAt: Date.now() }),
  resolveSos: () => set({ status: "resolved" }),
  reset: () => set({ status: "idle", location: null, triggeredAt: null }),
}));
