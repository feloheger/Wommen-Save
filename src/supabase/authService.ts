/**
 * Auth Service – ersetzt firebase/authService.ts
 * E-Mail + Passwort Login über Supabase Auth
 */
import { supabase } from "./supabaseClient";

export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // wird in user_metadata gespeichert
    },
  });
  if (error) throw error;
};

export const requestPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

export const resendVerificationEmail = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Kein Nutzer eingeloggt");
  const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
  if (error) throw error;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const subscribeToAuthChanges = (
  callback: (user: { id: string; email: string | null; name: string | null; emailVerified: boolean } | null) => void
) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      callback(null);
      return;
    }
    callback({
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.user_metadata?.name ?? null,
      emailVerified: !!session.user.confirmed_at,
    });
  });
  return () => data.subscription.unsubscribe();
};
