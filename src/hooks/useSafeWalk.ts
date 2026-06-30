/**
 * Hook – Safe Walk Logik mit Live-Tracking, Timer und automatischem SOS
 */
import { useCallback, useEffect, useRef } from "react";

import { watchLocation } from "@services/locationService";
import { useSafeWalkStore } from "@store/safeWalkStore";
import { useSos } from "@hooks/useSos";
import { SAFE_WALK_CHECK_IN_GRACE_PERIOD_SEC } from "@constants/config";

export const useSafeWalk = () => {
  const {
    status,
    destination,
    durationMin,
    route,
    startWalk,
    addRoutePoint,
    requestCheckIn,
    confirmSafe,
    triggerAlert,
    endWalk,
  } = useSafeWalkStore();

  const { startSos } = useSos();
  const checkInTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchSubscriptionRef = useRef<{ remove: () => void } | null>(null);

  // Live-Standort-Tracking während eines aktiven Safe Walks
  useEffect(() => {
    if (status !== "active") return;

    let isMounted = true;
    watchLocation((point) => {
      if (isMounted) addRoutePoint(point);
    }).then((sub) => {
      watchSubscriptionRef.current = sub;
    });

    return () => {
      isMounted = false;
      watchSubscriptionRef.current?.remove();
    };
  }, [status, addRoutePoint]);

  const begin = useCallback(
    (dest: string, minutes: number) => {
      startWalk(dest, minutes);

      // Nach Ablauf der gewählten Dauer wird ein Check-in angefordert
      checkInTimeoutRef.current = setTimeout(
        () => {
          requestCheckIn();

          // Wenn der Check-in nicht innerhalb der Schonfrist bestätigt wird -> automatischer SOS
          checkInTimeoutRef.current = setTimeout(async () => {
            triggerAlert();
            await startSos();
          }, SAFE_WALK_CHECK_IN_GRACE_PERIOD_SEC * 1000);
        },
        minutes * 60 * 1000,
      );
    },
    [startWalk, requestCheckIn, triggerAlert, startSos],
  );

  const confirmCheckIn = useCallback(() => {
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
    confirmSafe();
  }, [confirmSafe]);

  const finish = useCallback(() => {
    if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
    watchSubscriptionRef.current?.remove();
    endWalk();
  }, [endWalk]);

  useEffect(() => {
    return () => {
      if (checkInTimeoutRef.current) clearTimeout(checkInTimeoutRef.current);
      watchSubscriptionRef.current?.remove();
    };
  }, []);

  return { status, destination, durationMin, route, begin, confirmCheckIn, finish };
};
