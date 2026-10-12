/**
 * Alarm – lauter Sirenenton, Vibration, blinkender Bildschirm
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Siren, X } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { Colors, Fonts } from "@/theme";

export const AlarmScreen: React.FC = () => {
  const [active, setActive] = useState(false);
  const sound = useRef<Audio.Sound | null>(null);
  const vib = useRef<ReturnType<typeof setInterval> | null>(null);
  const flash = useSharedValue(0);

  const stop = useCallback(async () => {
    setActive(false);
    if (vib.current) clearInterval(vib.current);
    vib.current = null;
    flash.value = 0;
    const s = sound.current;
    sound.current = null;
    if (s) {
      await s.stopAsync().catch(() => {});
      await s.unloadAsync().catch(() => {});
    }
  }, [flash]);

  const start = useCallback(async () => {
    setActive(true);
    flash.value = withRepeat(withTiming(1, { duration: 400 }), -1, true);
    vib.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }, 800);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: s } = await Audio.Sound.createAsync(require("../../assets/sounds/siren.wav"), {
        isLooping: true,
        volume: 1.0,
        shouldPlay: true,
      });
      sound.current = s;
    } catch {
      /* Ohne Ton bleiben Vibration und Blinken aktiv */
    }
  }, [flash]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  const flashStyle = useAnimatedStyle(() => ({
    backgroundColor: flash.value > 0.5 ? Colors.danger : Colors.text,
  }));

  if (active) {
    return (
      <Animated.View style={[styles.flex, flashStyle]}>
        <View style={styles.activeInner}>
          <Siren size={72} color={Colors.white} />
          <Text style={styles.activeTitle}>ALARM AKTIV</Text>
          <Text style={styles.activeText}>
            Sirene, Vibration und Blinken sind an, um Aufmerksamkeit zu erregen.
          </Text>
          <Pressable
            onPress={stop}
            style={styles.stop}
            accessibilityRole="button"
            accessibilityLabel="Alarm stoppen"
          >
            <X size={30} color={Colors.text} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return (
    <Screen title="Alarm" back>
      <Text style={styles.lead}>
        Löse einen lauten Sirenenalarm aus, um Aufmerksamkeit auf dich zu ziehen. Stell vorher die
        Lautstärke hoch.
      </Text>
      <Pressable
        onPress={start}
        style={styles.startBtn}
        accessibilityRole="button"
        accessibilityLabel="Alarm starten"
      >
        <Siren size={48} color={Colors.white} />
        <Text style={styles.startText}>Alarm starten</Text>
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  lead: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginVertical: 24,
  },
  startBtn: {
    alignSelf: "center",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.white, marginTop: 8 },
  activeInner: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  activeTitle: { fontFamily: Fonts.bold, fontSize: 30, color: Colors.white, marginTop: 20 },
  activeText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: 8,
  },
  stop: {
    marginTop: 48,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
