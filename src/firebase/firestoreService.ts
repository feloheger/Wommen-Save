/**
 * Firestore Service – Vertrauenspersonen, SOS-Events, Safe Walks
 */
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "./firebaseConfig";
import type { TrustedContact, SosEvent, SafeWalkSession } from "@types/index";

// --- Vertrauenspersonen ---
export const getContacts = async (userId: string): Promise<TrustedContact[]> => {
  const q = query(collection(firestore, "users", userId, "contacts"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as TrustedContact);
};

export const addContact = async (userId: string, contact: Omit<TrustedContact, "id">) => {
  return addDoc(collection(firestore, "users", userId, "contacts"), contact);
};

export const updateContact = async (
  userId: string,
  contactId: string,
  data: Partial<TrustedContact>,
) => {
  return updateDoc(doc(firestore, "users", userId, "contacts", contactId), data);
};

export const deleteContact = async (userId: string, contactId: string) => {
  return deleteDoc(doc(firestore, "users", userId, "contacts", contactId));
};

// --- SOS Events ---
export const createSosEvent = async (
  userId: string,
  event: Omit<SosEvent, "id" | "createdAt">,
) => {
  return addDoc(collection(firestore, "users", userId, "sosEvents"), {
    ...event,
    createdAt: serverTimestamp(),
  });
};

export const updateSosEvent = async (
  userId: string,
  eventId: string,
  data: Partial<SosEvent>,
) => {
  return updateDoc(doc(firestore, "users", userId, "sosEvents", eventId), data);
};

// --- Safe Walk ---
export const createSafeWalkSession = async (
  userId: string,
  session: Omit<SafeWalkSession, "id">,
) => {
  return addDoc(collection(firestore, "users", userId, "safeWalks"), session);
};

export const updateSafeWalkSession = async (
  userId: string,
  sessionId: string,
  data: Partial<SafeWalkSession>,
) => {
  return updateDoc(doc(firestore, "users", userId, "safeWalks", sessionId), data);
};

export const getActiveSafeWalkContacts = async (userId: string) => {
  const q = query(
    collection(firestore, "users", userId, "contacts"),
    where("isFavorite", "==", true),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as TrustedContact);
};
