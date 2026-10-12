/**
 * Safe-Journey-Logik auf Modulebene: Timer laufen weiter, auch wenn der Screen verlassen wird.
 * Zusätzlich wird eine lokale Benachrichtigung geplant, falls die App im Hintergrund ist.
 */
import { JOURNEY_GRACE_SEC } from "@/constants";
import { cancelScheduled, scheduleAt, showNow } from "@/services/notificationService";
import { runSos } from "@/services/sosService";
import { useJourneyStore } from "@/store/journeyStore";
import { useSosStore } from "@/store/sosStore";

let checkInTimer: ReturnType<typeof setTimeout> | null = null;
let graceTimer: ReturnType<typeof setTimeout> | null = null;
let notificationId: string | null = null;

const clearTimers = () => {
  if (checkInTimer) clearTimeout(checkInTimer);
  if (graceTimer) clearTimeout(graceTimer);
  checkInTimer = null;
  graceTimer = null;
  void cancelScheduled(notificationId);
  notificationId = null;
};

const armCheckIn = (endsAt: number) => {
  checkInTimer = setTimeout(
    () => {
      const graceEndsAt = Date.now() + JOURNEY_GRACE_SEC * 1000;
      useJourneyStore.getState().requestCheckIn(graceEndsAt);
      void showNow(
        "Bist du sicher angekommen?",
        "Bitte bestätige in der App, sonst wird ein SOS ausgelöst.",
      );

      graceTimer = setTimeout(() => {
        useJourneyStore.getState().triggerAlert();
        useSosStore.getState().startCountdown();
        void runSos();
      }, JOURNEY_GRACE_SEC * 1000);
    },
    Math.max(0, endsAt - Date.now()),
  );

  void scheduleAt(
    "Bist du sicher angekommen?",
    "Dein Safe Journey ist abgelaufen. Bitte bestätige in der App.",
    new Date(endsAt),
  ).then((id) => {
    notificationId = id;
  });
};

export const startJourney = (destination: string, minutes: number) => {
  clearTimers();
  const endsAt = Date.now() + minutes * 60 * 1000;
  useJourneyStore.getState().begin(destination, endsAt);
  armCheckIn(endsAt);
};

/** Bestätigung im Check-in -> weiter mit 10 Minuten Verlängerung */
export const confirmArrived = () => {
  clearTimers();
  useJourneyStore.getState().end();
};

export const extendJourney = (minutes = 10) => {
  clearTimers();
  const endsAt = Date.now() + minutes * 60 * 1000;
  useJourneyStore.getState().confirmSafe(endsAt);
  armCheckIn(endsAt);
};

export const endJourney = () => {
  clearTimers();
  useJourneyStore.getState().end();
};
