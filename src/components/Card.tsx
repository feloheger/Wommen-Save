import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { Colors, Radius, Shadow } from "@/theme";

export const Card: React.FC<ViewProps> = ({ style, children, ...rest }) => (
  <View style={[styles.card, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    ...Shadow.card,
  },
});
