/**
 * SMS – öffnet den System-Composer mit vorbereiteter Nachricht.
 * Hinweis: Apps dürfen SMS nicht still versenden; die Person muss im Composer auf "Senden" tippen.
 */
import * as SMS from "expo-sms";

import { APP_NAME } from "@/constants";
import { buildMapsLink } from "@/services/locationService";
import type { LocationPoint, TrustedContact } from "@/types";

export const buildSosMessage = (location: LocationPoint | null): string => {
  const where = location ? buildMapsLink(location) : "Standort leider nicht verfügbar";
  return `🚨 NOTFALL: Ich brauche Hilfe!\nMein Standort: ${where}\nGesendet über ${APP_NAME}.`;
};

export const buildShareMessage = (location: LocationPoint): string =>
  `📍 Mein aktueller Standort: ${buildMapsLink(location)}\nGeteilt über ${APP_NAME}.`;

/** true, wenn der Composer geöffnet und nicht abgebrochen wurde */
export const composeSms = async (contacts: TrustedContact[], message: string): Promise<boolean> => {
  try {
    if (contacts.length === 0) return false;
    if (!(await SMS.isAvailableAsync())) return false;
    const { result } = await SMS.sendSMSAsync(
      contacts.map((c) => c.phone),
      message,
    );
    return result !== "cancelled";
  } catch {
    return false;
  }
};
