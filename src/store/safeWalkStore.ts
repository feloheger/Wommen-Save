/**
 * Zustand Store – Safe Walk Session
 */
import { create } from "zustand";
import type { SafeWalkStatus, LocationPoint } from "@types/index";

interface SafeWalkState {
  status: SafeWalkStatus;
  destination: string;
  durationMin: number;
  startedAt: number | null;
  route: LocationPoint[];
  startWalk: (destination: string, durationMin: number) => void;
  addRoutePoint: (point: LocationPoint) => void;
  requestCheckIn: () => void;
  confirmSafe: () => void;
  triggerAlert: () => void;
  endWalk: () => void;
}

export const useSafeWalkStore = create<SafeWalkState>((set) => ({
  status: "idle",
  destination: "",
  durationMin: 15,
  startedAt: null,
  route: [],
  startWalk: (destination, durationMin) =>
    set({ status: "active", destination, durationMin, startedAt: Date.now(), route: [] }),
  addRoutePoint: (point) => set((state) => ({ route: [...state.route, point] })),
  requestCheckIn: () => set({ status: "checkin_pending" }),
  confirmSafe: () => set({ status: "active" }),
  triggerAlert: () => set({ status: "alert" }),
  endWalk: () => set({ status: "completed", startedAt: null, route: [] }),
}));
