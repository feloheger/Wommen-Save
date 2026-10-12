/**
 * Vertrauenspersonen – persistiert, damit sie einen App-Neustart überleben
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { TrustedContact } from "@/types";

interface ContactsState {
  contacts: TrustedContact[];
  addContact: (contact: TrustedContact) => void;
  updateContact: (id: string, data: Partial<Omit<TrustedContact, "id">>) => void;
  removeContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set) => ({
      contacts: [],
      addContact: (contact) => set((s) => ({ contacts: [...s.contacts, contact] })),
      updateContact: (id, data) =>
        set((s) => ({ contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      removeContact: (id) => set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),
      toggleFavorite: (id) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
        })),
    }),
    { name: "ws-contacts", storage: createJSONStorage(() => AsyncStorage) },
  ),
);

/** Wer im Notfall benachrichtigt wird: Favoriten, sonst alle. */
export const selectEmergencyTargets = (contacts: TrustedContact[]): TrustedContact[] => {
  const favorites = contacts.filter((c) => c.isFavorite);
  return favorites.length > 0 ? favorites : contacts;
};
