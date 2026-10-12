/**
 * SOS-Ablauf als reine Funktion (kein Hook), damit auch Safe Journey ihn auslösen kann.
 * Jeder Schritt ist abgesichert: ein Fehler (z. B. kein GPS) bricht den Notruf NICHT ab.
 */
import * as Haptics from "expo-haptics";

import { getCurrentLocation } from "@/services/locationService";
import { showNow } from "@/services/notificationService";
import { buildSosMessage, composeSms } from "@/services/smsService";
import { selectEmergencyTargets, useContactsStore } from "@/store/contactsStore";
import { useSosStore, type SosResult } from "@/store/sosStore";

export const runSos = async (): Promise<SosResult> => {
  const store = useSosStore.getState();
  store.setSending();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});

  const location = await getCurrentLocation();
  const targets = selectEmergencyTargets(useContactsStore.getState().contacts);
  const smsComposed = await composeSms(targets, buildSosMessage(location));
  await showNow("SOS ausgelöst", "Dein Notruf wurde vorbereitet.");

  const result: SosResult = { location, contactCount: targets.length, smsComposed };
  useSosStore.getState().finish(result);
  return result;
};
