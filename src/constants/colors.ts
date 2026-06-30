/**
 * Women Save – zentrales Farbsystem
 * Premium, vertrauenswürdig, minimalistisch
 */
export const Colors = {
  primary: "#7C5CFC",
  secondary: "#B79CFF",
  background: "#FFFFFF",
  accent: "#F3EEFF",
  danger: "#FF4D6A",
  success: "#34C77B",
  warning: "#FFB020",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B6B85",
  border: "#ECE7FA",
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(26, 26, 46, 0.6)",
} as const;

export const Gradients = {
  primary: ["#7C5CFC", "#B79CFF"] as const,
  danger: ["#FF4D6A", "#FF7A93"] as const,
  dark: ["#2E1F66", "#7C5CFC"] as const,
};
