import React from "react";
import { StyleSheet, Text } from "react-native";
import { Watch } from "lucide-react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Colors, Fonts } from "@/theme";

export const SmartwatchScreen: React.FC = () => (
  <Screen title="Smartwatch-Anbindung" back>
    <Card style={{ alignItems: "center", paddingVertical: 28, marginBottom: 16 }}>
      <Watch size={36} color={Colors.primary} />
      <Text style={styles.title}>Bald verfügbar</Text>
      <Text style={styles.text}>
        SOS und Standort direkt vom Handgelenk sind ein Premium-Feature und werden gerade
        entwickelt.
      </Text>
    </Card>
    <Button label="Premium ansehen" variant="outline" onPress={() => router.push("/premium")} />
  </Screen>
);

const styles = StyleSheet.create({
  title: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text, marginTop: 12 },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
});
