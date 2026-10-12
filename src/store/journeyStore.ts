/**
 * Safe-Journey-Sitzung. Zeitpunkte statt Zähler, damit der Stand
 * auch nach Screenwechsel korrekt bleibt.
 */
import { create } from "zustand";

import type { JourneyStatus, LocationPoint } from "@/types";

interface JourneyState {
  status: JourneyStatus;
  destination: string;
  startedAt: number | null;
  endsAt: number | null;
  graceEndsAt: number | null;
  route: LocationPoint[];
  begin: (destination: string, endsAt: number) => void;
  addRoutePoint: (point: LocationPoint) => void;
  requestCheckIn: (graceEndsAt: number) => void;
  confirmSafe: (endsAt: number) => void;
  triggerAlert: () => void;
  end: () => void;
}

const empty = {
  status: "idle" as JourneyStatus,
  destination: "",
  startedAt: null,
  endsAt: null,
  graceEndsAt: null,
  route: [] as LocationPoint[],
};

export const useJourneyStore = create<JourneyState>((set) => ({
  ...empty,
  begin: (destination, endsAt) =>
    set({ ...empty, status: "active", destination, startedAt: Date.now(), endsAt }),
  addRoutePoint: (point) => set((s) => ({ route: [...s.route, point] })),
  requestCheckIn: (graceEndsAt) => set({ status: "checkin_pending", graceEndsAt }),
  confirmSafe: (endsAt) => set({ status: "active", endsAt, graceEndsAt: null }),
  triggerAlert: () => set({ status: "alert", graceEndsAt: null }),
  end: () => set({ ...empty }),
}));
