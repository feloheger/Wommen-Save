import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ExternalLink } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { TIP_CATEGORIES } from "@/data/tips";
import { Colors, Fonts } from "@/theme";

export const TipDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = TIP_CATEGORIES.find((c) => c.id === id);

  if (!category) {
    return (
      <Screen title="Sicherheitstipps" back>
        <Text style={styles.text}>Dieser Inhalt wurde nicht gefunden.</Text>
      </Screen>
    );
  }

  return (
    <Screen title={category.title} back>
      {!!category.intro && <Text style={styles.intro}>{category.intro}</Text>}
      {category.items.map((item) => (
        <Card key={item.title} style={{ marginBottom: 12 }}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </Card>
      ))}
      {category.links?.map((l) => (
        <Pressable
          key={l.url}
          onPress={() => Linking.openURL(l.url)}
          style={styles.link}
          accessibilityRole="link"
        >
          <ExternalLink size={16} color={Colors.primary} />
          <Text style={styles.linkText}>{l.label}</Text>
        </Pressable>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  intro: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 14,
    lineHeight: 21,
  },
  itemTitle: { fontFamily: Fonts.semibold, fontSize: 14.5, color: Colors.text, marginBottom: 4 },
  text: { fontFamily: Fonts.regular, fontSize: 13.5, color: Colors.textMuted, lineHeight: 20 },
  link: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10 },
  linkText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
