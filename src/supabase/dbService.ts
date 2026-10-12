/**
 * Datenbank Service – ersetzt firebase/firestoreService.ts
 * Kontakte, SOS-Events und Safe Walks über Supabase Postgres
 *
 * Voraussetzung: Tabellen in Supabase anlegen (siehe README unten)
 *
 * SQL zum Anlegen der Tabellen (einmalig in Supabase SQL Editor ausführen):
 *
 * create table contacts (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users not null,
 *   name text not null,
 *   phone text not null,
 *   is_favorite boolean default false,
 *   created_at timestamptz default now()
 * );
 * alter table contacts enable row level security;
 * create policy "Nur eigene Kontakte" on contacts for all using (auth.uid() = user_id);
 *
 * create table sos_events (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users not null,
 *   location text,
 *   status text default 'active',
 *   created_at timestamptz default now()
 * );
 * alter table sos_events enable row level security;
 * create policy "Nur eigene SOS Events" on sos_events for all using (auth.uid() = user_id);
 *
 * create table safe_walks (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users not null,
 *   started_at timestamptz default now(),
 *   ended_at timestamptz,
 *   status text default 'active'
 * );
 * alter table safe_walks enable row level security;
 * create policy "Nur eigene Safe Walks" on safe_walks for all using (auth.uid() = user_id);
 */
import { supabase } from "./supabaseClient";
import type { TrustedContact, SosEvent, SafeWalkSession } from "@types";

// --- Vertrauenspersonen ---
export const getContacts = async (userId: string): Promise<TrustedContact[]> => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data as TrustedContact[];
};

export const addContact = async (userId: string, contact: Omit<TrustedContact, "id">) => {
  const { error } = await supabase.from("contacts").insert({ ...contact, user_id: userId });
  if (error) throw error;
};

export const updateContact = async (
  _userId: string,
  contactId: string,
  data: Partial<TrustedContact>
) => {
  const { error } = await supabase.from("contacts").update(data).eq("id", contactId);
  if (error) throw error;
};

export const deleteContact = async (_userId: string, contactId: string) => {
  const { error } = await supabase.from("contacts").delete().eq("id", contactId);
  if (error) throw error;
};

// --- SOS Events ---
export const createSosEvent = async (
  userId: string,
  event: Omit<SosEvent, "id" | "createdAt">
) => {
  const { error } = await supabase.from("sos_events").insert({ ...event, user_id: userId });
  if (error) throw error;
};

export const updateSosEvent = async (
  _userId: string,
  eventId: string,
  data: Partial<SosEvent>
) => {
  const { error } = await supabase.from("sos_events").update(data).eq("id", eventId);
  if (error) throw error;
};

// --- Safe Walk ---
export const createSafeWalkSession = async (
  userId: string,
  session: Omit<SafeWalkSession, "id">
) => {
  const { error } = await supabase.from("safe_walks").insert({ ...session, user_id: userId });
  if (error) throw error;
};

export const updateSafeWalkSession = async (
  _userId: string,
  sessionId: string,
  data: Partial<SafeWalkSession>
) => {
  const { error } = await supabase.from("safe_walks").update(data).eq("id", sessionId);
  if (error) throw error;
};

export const getActiveSafeWalkContacts = async (userId: string): Promise<TrustedContact[]> => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favorite", true);
  if (error) throw error;
  return data as TrustedContact[];
};
