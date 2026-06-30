/**
 * Hook – steuert den lauten Sirenen-Alarm mit Vibration und Bildschirm-Blinken
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

export const useAlarm = () => {
  const [isActive, setIsActive] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const vibrationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAlarm = useCallback(async () => {
    setIsActive(true);

    // Wiederholende starke Vibration als Alarm-Feedback
    vibrationIntervalRef.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }, 800);

    // Sirenen-Sound abspielen (Datei muss unter assets/sounds/siren.mp3 bereitgestellt werden)
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/siren.mp3"),
        { isLooping: true, volume: 1.0 },
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      // Fällt zurück auf reine Vibration, falls keine Audiodatei vorhanden ist
    }
  }, []);

  const stopAlarm = useCallback(async () => {
    setIsActive(false);
    if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
      soundRef.current?.unloadAsync();
    };
  }, []);

  return { isActive, startAlarm, stopAlarm };
};
