/**
 * Hook für Authentifizierungs-Logik & Session-Listener
 */
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { subscribeToAuthChanges } from "@firebase-config/authService";
import { firestore } from "@firebase-config/firebaseConfig";
import { useAuthStore } from "@store/authStore";
import type { UserProfile } from "@types";

export const useAuth = () => {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profileSnap = await getDoc(doc(firestore, "users", firebaseUser.uid));
      const profileData = profileSnap.data();

      const profile: UserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? profileData?.name ?? "Nutzerin",
        email: firebaseUser.email ?? "",
        photoURL: firebaseUser.photoURL ?? undefined,
        isPremium: profileData?.isPremium ?? false,
        emailVerified: firebaseUser.emailVerified,
        createdAt: profileData?.createdAt?.toDate?.().toISOString?.() ?? new Date().toISOString(),
      };

      setUser(profile);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  return { user, isLoading, isAuthenticated: !!user };
};
