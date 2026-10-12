/**
 * Merkt sich, mit wie vielen Personen der Standort zuletzt geteilt wurde (nur Sitzung).
 */
import { create } from "zustand";

interface ShareState {
  sharedWith: number;
  sharedAt: number | null;
  setShared: (count: number) => void;
  clear: () => void;
}

export const useShareStore = create<ShareState>((set) => ({
  sharedWith: 0,
  sharedAt: null,
  setShared: (sharedWith) => set({ sharedWith, sharedAt: Date.now() }),
  clear: () => set({ sharedWith: 0, sharedAt: null }),
}));
