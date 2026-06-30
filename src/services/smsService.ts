/**
 * SMS-Service – bereitet Notfall-Nachrichten vor und versendet sie
 */
import * as SMS from "expo-sms";
import type { LocationPoint, TrustedContact } from "@types/index";
import { buildGoogleMapsLink } from "./locationService";

export const buildSosMessage = (userName: string, location: LocationPoint | null): string => {
  const mapsLink = location ? buildGoogleMapsLink(location) : "Standort nicht verfügbar";
  return `🚨 NOTFALL: ${userName} benötigt Hilfe!\nStandort: ${mapsLink}\nGesendet über Women Save.`;
};

export const sendSosSms = async (
  contacts: TrustedContact[],
  message: string,
): Promise<boolean> => {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) return false;

  const numbers = contacts.map((c) => c.phone);
  const { result } = await SMS.sendSMSAsync(numbers, message);
  return result === "sent" || result === "unknown";
};
