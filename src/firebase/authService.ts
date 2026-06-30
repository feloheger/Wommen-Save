/**
 * Firebase Authentication Service
 * Login, Registrierung, Passwort vergessen, E-Mail-Verifizierung
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, firestore } from "./firebaseConfig";

export const registerUser = async (name: string, email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);

  // Initiales Nutzerprofil in Firestore anlegen
  await setDoc(doc(firestore, "users", credential.user.uid), {
    name,
    email,
    isPremium: false,
    createdAt: serverTimestamp(),
  });

  return credential.user;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const requestPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async (user: User) => {
  await sendEmailVerification(user);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
