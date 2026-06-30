/**
 * Hook – steuert den Fake Call Timer und Aktivierung
 */
import { useCallback, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";

import type { FakeCallProfile } from "@types/index";

export const useFakeCall = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [caller, setCaller] = useState<FakeCallProfile | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCall = useCallback((profile: FakeCallProfile, delaySeconds: number) => {
    setCaller(profile);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsRinging(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, delaySeconds * 1000);
  }, []);

  const cancelScheduledCall = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRinging(false);
  }, []);

  const endCall = useCallback(() => {
    setIsRinging(false);
    setCaller(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isRinging, caller, scheduleCall, cancelScheduledCall, endCall };
};
