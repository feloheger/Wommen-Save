/**
 * Glassmorphism Card – für Premium-Banner & Overlays
 */
import React from "react";
import { View, type ViewProps, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 40,
  style,
  ...rest
}) => {
  return (
    <BlurView
      intensity={intensity}
      tint="light"
      style={[styles.container, style]}
      {...rest}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
});
