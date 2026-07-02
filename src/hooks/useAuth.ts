/**
 * Hook für Authentifizierungs-Logik & Session-Listener
 */
import { useEffect } from "react";
import { supabase } from "@supabaseConfig/supabaseClient";
import { useAuthStore } from "@store/authStore";
import type { UserProfile } from "@types";

export const useAuth = () => {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Direkt beim Start Session prüfen
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile: UserProfile = {
        uid: session.user.id,
        name: session.user.user_metadata?.name ?? "Nutzerin",
        email: session.user.email ?? "",
        isPremium: false,
        emailVerified: !!session.user.confirmed_at,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      setLoading(false);
    });

    // Auth-Änderungen beobachten
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile: UserProfile = {
        uid: session.user.id,
        name: session.user.user_metadata?.name ?? "Nutzerin",
        email: session.user.email ?? "",
        isPremium: false,
        emailVerified: !!session.user.confirmed_at,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return { user, isLoading, isAuthenticated: !!user };
};