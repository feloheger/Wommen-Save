/**
 * Premium Button-Komponente mit Haptic Feedback & Animation
 */
import React from "react";
import { Pressable, Text, ActivityIndicator, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { Gradients } from "@constants/colors";

type Variant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  loading,
  icon,
  fullWidth = true,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1);
    onPressOut?.(e);
  };

  const isOutline = variant === "outline";
  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={isOutline ? "#7C5CFC" : "#FFFFFF"} />
      ) : (
        <>
          {icon}
          <Text
            className={`font-poppins-semibold text-base ${
              isOutline ? "text-primary" : "text-white"
            } ${icon ? "ml-2" : ""}`}
          >
            {label}
          </Text>
        </>
      )}
    </>
  );

  if (isOutline) {
    return (
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center rounded-2xl border-2 border-primary py-4 px-6 ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-50" : ""}`}
        {...rest}
      >
        {content}
      </AnimatedPressable>
    );
  }

  const gradientColors = variant === "danger" ? Gradients.danger : Gradients.primary;

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      className={`${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50" : ""}`}
      {...rest}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24 }}
        className="flex-row items-center justify-center shadow-lg"
      >
        {content}
      </LinearGradient>
    </AnimatedPressable>
  );
};
