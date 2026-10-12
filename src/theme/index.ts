/**
 * Design-Tokens – abgeleitet aus dem Mockup (Beerentöne auf zartem Rosé).
 */
export const Colors = {
  primary: "#8B3A62",
  primaryDark: "#6B2D5C",
  primaryLight: "#B4668D",
  bg: "#FBF1F1",
  bgDeep: "#F5E4E6",
  card: "#FFF9F9",
  cardBorder: "#F3E0E3",
  text: "#3B2631",
  textMuted: "#8C7882",
  placeholder: "#B7A5AD",
  white: "#FFFFFF",
  success: "#4E9F7D",
  danger: "#C2455F",
  warning: "#D99A3D",
  overlay: "rgba(59, 38, 49, 0.45)",
} as const;

export const Gradients = {
  background: ["#FDF5F5", "#F8E8EA"] as const,
  sos: ["#B0557F", "#8B3A62"] as const,
  button: ["#9A4570", "#7E3258"] as const,
  splash: ["#3D2A63", "#8B3A62", "#E58A9C"] as const,
  alarm: ["#8B3A62", "#3B2631"] as const,
};

export const Radius = { sm: 12, md: 18, lg: 24, pill: 999 } as const;

export const Fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;

export const Shadow = {
  card: {
    shadowColor: "#8B3A62",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;
