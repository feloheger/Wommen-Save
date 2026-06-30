/**
 * Zustand Store – Vertrauenspersonen
 */
import { create } from "zustand";
import type { TrustedContact } from "@types/index";

interface ContactsState {
  contacts: TrustedContact[];
  setContacts: (contacts: TrustedContact[]) => void;
  addContact: (contact: TrustedContact) => void;
  updateContact: (id: string, data: Partial<TrustedContact>) => void;
  removeContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (id, data) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  removeContact: (id) =>
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
  toggleFavorite: (id) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c,
      ),
    })),
}));
