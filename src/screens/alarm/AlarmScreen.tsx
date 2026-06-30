/**
 * Alarm Screen – lauter Sirenen-Alarm mit blinkendem Bildschirm und Vibration
 */
import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Siren, X } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { useAlarm } from "@hooks/useAlarm";

export const AlarmScreen: React.FC = () => {
  const { isActive, startAlarm, stopAlarm } = useAlarm();
  const flash = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      flash.value = withRepeat(
        withSequence(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 })),
        -1,
        true,
      );
    } else {
      flash.value = 0;
    }
  }, [isActive, flash]);

  const flashStyle = useAnimatedStyle(() => ({
    backgroundColor: flash.value > 0.5 ? "#FF4D6A" : "#1A1A2E",
  }));

  if (isActive) {
    return (
      <Animated.View style={[{ flex: 1 }, flashStyle]}>
        <ScreenContainer scroll={false} className="bg-transparent">
          <View className="flex-1 items-center justify-center px-4">
            <Siren size={64} color="#FFFFFF" />
            <Text className="mt-6 text-center font-poppins-bold text-2xl text-white">
              ALARM AKTIV
            </Text>
            <Text className="mt-2 text-center font-poppins text-sm text-white/80">
              Sirene und Vibration sind aktiv, um Aufmerksamkeit zu erregen.
            </Text>

            <Pressable
              onPress={stopAlarm}
              className="mt-12 h-16 w-16 items-center justify-center rounded-full bg-white"
            >
              <X size={28} color="#1A1A2E" />
            </Pressable>
          </View>
        </ScreenContainer>
      </Animated.View>
    );
  }

  return (
    <ScreenContainer>
      <View className="mt-6 mb-10 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          <Siren size={32} color="#7C5CFC" />
        </View>
        <Text className="font-poppins-bold text-2xl text-textPrimary">Alarm</Text>
        <Text className="mt-2 text-center font-poppins text-sm text-textSecondary">
          Löse einen lauten Sirenen-Alarm mit blinkendem Bildschirm und Vibration aus, um
          Aufmerksamkeit auf dich zu ziehen.
        </Text>
      </View>

      <Pressable
        onPress={startAlarm}
        className="mb-4 h-44 w-44 items-center justify-center self-center rounded-full bg-danger"
      >
        <Siren size={48} color="#FFFFFF" />
        <Text className="mt-2 font-poppins-bold text-lg text-white">Alarm starten</Text>
      </Pressable>
    </ScreenContainer>
  );
};
