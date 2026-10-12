/**
 * Sicherheitstipps – Kategorienliste
 */
import React from "react";
import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { BookOpen, Building2, Phone, ShieldAlert, Siren } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { ListRow } from "@/components/ListRow";
import { TIP_CATEGORIES } from "@/data/tips";
import { Colors, Fonts } from "@/theme";

const icons: Record<string, React.ReactNode> = {
  alltag: <Siren size={20} color={Colors.white} />,
  gefahr: <ShieldAlert size={20} color={Colors.white} />,
  anlaufstellen: <Building2 size={20} color={Colors.white} />,
  wissen: <BookOpen size={20} color={Colors.white} />,
};

export const TipsScreen: React.FC = () => (
  <Screen title="Sicherheitstipps" back>
    <Text style={styles.lead}>
      Wissen kann Leben retten.{"\n"}Hier findest du wichtige Tipps für den Alltag und in
      Gefahrensituationen.
    </Text>

    {TIP_CATEGORIES.slice(0, 2).map((c) => (
      <ListRow
        key={c.id}
        icon={icons[c.id]}
        title={c.title}
        subtitle={c.subtitle}
        onPress={() => router.push(`/tips/${c.id}`)}
      />
    ))}
    <ListRow
      icon={<Phone size={20} color={Colors.white} />}
      title="Hilfsnummern"
      subtitle="Wichtige Kontakte auf einen Blick"
      onPress={() => router.push("/emergency-numbers")}
    />
    {TIP_CATEGORIES.slice(2).map((c) => (
      <ListRow
        key={c.id}
        icon={icons[c.id]}
        title={c.title}
        subtitle={c.subtitle}
        onPress={() => router.push(`/tips/${c.id}`)}
      />
    ))}
  </Screen>
);

const styles = StyleSheet.create({
  lead: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
});
