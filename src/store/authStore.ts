/**
 * Zustand Store – Authentifizierungs-Status
 */
import { create } from "zustand";
import type { UserProfile } from "@types/index";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false, // ← auf false geändert!
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));