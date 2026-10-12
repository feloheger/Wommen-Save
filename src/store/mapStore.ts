/**
 * Selbst markierte Gefahrenzonen – lokal persistiert
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DangerZone } from "@/types";

interface MapState {
  dangerZones: DangerZone[];
  addDangerZone: (zone: DangerZone) => void;
  removeDangerZone: (id: string) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      dangerZones: [],
      addDangerZone: (zone) => set((s) => ({ dangerZones: [...s.dangerZones, zone] })),
      removeDangerZone: (id) =>
        set((s) => ({ dangerZones: s.dangerZones.filter((z) => z.id !== id) })),
    }),
    { name: "ws-map", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
