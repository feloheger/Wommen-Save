/**
 * Feature-Karte für den Home Screen (Safe Walk, Live Standort, Alarm, Fake Call, Notruf)
 */
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
     
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-md shadow-black/5"
      style={[
        animatedStyle,
        {
          shadowColor: "#1A1A2E",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 2,
        },
      ]}
    >
      <View
        className="mb-3 h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1A` }}
      >
        {icon}
      </View>
      <Text className="font-poppins-semibold text-base text-textPrimary">{title}</Text>
      <Text className="mt-1 font-poppins text-xs text-textSecondary">{subtitle}</Text>
    </AnimatedPressable>
  );
};
