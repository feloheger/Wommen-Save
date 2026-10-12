/**
 * Einmaliges Teilen des aktuellen Standorts mit den Vertrauenspersonen.
 */
import { getCurrentLocation } from "@/services/locationService";
import { buildShareMessage, composeSms } from "@/services/smsService";
import { selectEmergencyTargets, useContactsStore } from "@/store/contactsStore";
import { useShareStore } from "@/store/shareStore";

export type ShareOutcome = "shared" | "no_contacts" | "no_location" | "cancelled";

export const shareLocationWithContacts = async (): Promise<ShareOutcome> => {
  const targets = selectEmergencyTargets(useContactsStore.getState().contacts);
  if (targets.length === 0) return "no_contacts";

  const location = await getCurrentLocation();
  if (!location) return "no_location";

  const ok = await composeSms(targets, buildShareMessage(location));
  if (!ok) return "cancelled";

  useShareStore.getState().setShared(targets.length);
  return "shared";
};
