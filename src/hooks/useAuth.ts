/**
 * Hook für Authentifizierungs-Logik & Session-Listener
 * Ersetzt firebase-basierte useAuth.ts → nutzt jetzt Supabase
 */
import { useEffect } from "react";
import { subscribeToAuthChanges } from "@supabaseConfig/authService";
import { useAuthStore } from "@store/authStore";
import type { UserProfile } from "@types";

export const useAuth = () => {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Fallback: nach 3 Sekunden isLoading auf false setzen
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = subscribeToAuthChanges((supabaseUser) => {
      clearTimeout(timeout);

      if (!supabaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile: UserProfile = {
        uid: supabaseUser.id,
        name: supabaseUser.name ?? "Nutzerin",
        email: supabaseUser.email ?? "",
        isPremium: false,
        emailVerified: supabaseUser.emailVerified,
        createdAt: new Date().toISOString(),
      };

      setUser(profile);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [setUser, setLoading]);

  return { user, isLoading, isAuthenticated: !!user };
};
