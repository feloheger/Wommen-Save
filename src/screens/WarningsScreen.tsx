import React from "react";
import { Linking, StyleSheet, Text } from "react-native";
import { Bell } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Colors, Fonts } from "@/theme";

export const WarningsScreen: React.FC = () => (
  <Screen title="Sicherheitswarnungen" back>
    <Card style={{ alignItems: "center", paddingVertical: 28 }}>
      <Bell size={32} color={Colors.primary} />
      <Text style={styles.title}>Aktuell keine Warnungen</Text>
      <Text style={styles.text}>
        Live-Warnungen für deine Umgebung sind in Arbeit. Bis dahin findest du amtliche Warnungen
        bei der NINA-Warn-App.
      </Text>
    </Card>
    <ListRow
      icon={<Bell size={20} color={Colors.white} />}
      title="NINA-Warn-App öffnen"
      subtitle="Offizielle Warnungen des Bundes"
      onPress={() =>
        Linking.openURL(
          "https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/warn-app-nina_node.html",
        )
      }
    />
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
