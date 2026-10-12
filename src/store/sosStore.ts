/**
 * SOS-Ablauf: countdown -> sending -> done
 */
import { create } from "zustand";

import type { LocationPoint, SosStatus } from "@/types";

export interface SosResult {
  location: LocationPoint | null;
  contactCount: number;
  smsComposed: boolean;
}

interface SosState {
  status: SosStatus;
  result: SosResult | null;
  startCountdown: () => void;
  setSending: () => void;
  finish: (result: SosResult) => void;
  reset: () => void;
}

export const useSosStore = create<SosState>((set) => ({
  status: "idle",
  result: null,
  startCountdown: () => set({ status: "countdown", result: null }),
  setSending: () => set({ status: "sending" }),
  finish: (result) => set({ status: "done", result }),
  reset: () => set({ status: "idle", result: null }),
}));
