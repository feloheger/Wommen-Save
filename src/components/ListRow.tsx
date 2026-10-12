/**
 * Listenzeile im Mockup-Stil: runder Icon-Kreis, Titel, Untertitel, Chevron.
 */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { Colors, Fonts, Radius, Shadow } from "@/theme";

interface ListRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  tone?: "default" | "danger";
}

export const ListRow: React.FC<ListRowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  right,
  tone = "default",
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? "button" : undefined}
    accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
  >
    <View style={[styles.icon, tone === "danger" && { backgroundColor: Colors.danger }]}>
      {icon}
    </View>
    <View style={styles.texts}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {right ?? (onPress ? <ChevronRight size={18} color={Colors.textMuted} /> : null)}
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...Shadow.card,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  texts: { flex: 1 },
  title: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  subtitle: { fontFamily: Fonts.regular, fontSize: 11.5, color: Colors.textMuted, marginTop: 1 },
});
