/**
 * Hook – kapselt die komplette SOS-Logik:
 * Standort abrufen -> Nachricht erstellen -> SMS vorbereiten -> Kontakte benachrichtigen -> Vibrationsalarm
 */
import { useCallback } from "react";
import * as Haptics from "expo-haptics";

import { getCurrentLocation } from "@services/locationService";
import { buildSosMessage, sendSosSms } from "@services/smsService";
import { scheduleLocalAlert } from "@services/notificationService";
import { useSosStore } from "@store/sosStore";
import { useContactsStore } from "@store/contactsStore";
import { useAuthStore } from "@store/authStore";

export const useSos = () => {
  const { status, triggerSos, resolveSos, reset } = useSosStore();
  const { contacts } = useContactsStore();
  const { user } = useAuthStore();

  const startSos = useCallback(async () => {
    // Starker Vibrationsalarm beim Auslösen
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // 1. Standort abrufen
    const location = await getCurrentLocation();
    triggerSos(location);

    // 2. Nachricht erstellen
    const message = buildSosMessage(user?.name ?? "Eine Nutzerin", location);

    // 3 & 4. SMS vorbereiten und Vertrauenspersonen benachrichtigen
    const favoriteContacts = contacts.filter((c) => c.isFavorite);
    const targets = favoriteContacts.length > 0 ? favoriteContacts : contacts;

    if (targets.length > 0) {
      await sendSosSms(targets, message);
    }

    // 5. Lokalen Alarm/Benachrichtigung anzeigen
    await scheduleLocalAlert("SOS ausgelöst", "Deine Vertrauenspersonen wurden informiert.");

    return { location, message };
  }, [contacts, triggerSos, user]);

  const cancelSos = useCallback(() => {
    reset();
  }, [reset]);

  return { status, startSos, resolveSos, cancelSos };
};
