/**
 * Premium – Vergleich Kostenlos / Premium wie im Mockup.
 * Hinweis: Es ist noch KEIN Zahlungsanbieter angebunden – in Release-Builds wird kein Premium vergeben.
 */
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Check, Crown } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { MAX_CONTACTS, PREMIUM_PRICE_MONTHLY, PREMIUM_PRICE_ONCE } from "@/constants";
import { useSettingsStore } from "@/store/settingsStore";
import { Colors, Fonts, Radius, Shadow } from "@/theme";

const FREE = [
  `Max. ${MAX_CONTACTS} Vertrauenspersonen`,
  "Grundlegende Sicherheitstools",
  "Wenig/keine Personalisierung",
];
const PREMIUM = [
  `Max. ${MAX_CONTACTS} Vertrauenspersonen`,
  "Zusätzliche Sicherheitstools",
  "Personalisierung",
  "Smartwatch-Anbindung",
  "Self-Care-Modus",
];

const Item: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.item}>
    <Check size={14} color={Colors.primary} style={{ marginTop: 2 }} />
    <Text style={styles.itemText}>{text}</Text>
  </View>
);

export const PremiumScreen: React.FC = () => {
  const { isPremium, setPremium } = useSettingsStore();

  const buy = () => {
    if (__DEV__) {
      setPremium(true); // nur zum Testen in der Entwicklung
      return;
    }
    Alert.alert("Bald verfügbar", "Der Kauf ist in dieser Version noch nicht freigeschaltet.");
  };

  return (
    <Screen title="Premium" back>
      <View style={styles.hero}>
        <Crown size={30} color={Colors.primary} />
        <Text style={styles.heroText}>Mehr Funktionen. Mehr Sicherheit.{"\n"}Für dich.</Text>
      </View>

      <View style={styles.cols}>
        <View style={styles.colFree}>
          <Text style={styles.colTitle}>Kostenlos</Text>
          {FREE.map((t) => (
            <Item key={t} text={t} />
          ))}
        </View>
        <View style={styles.colPremium}>
          <Text style={styles.colTitle}>Premium</Text>
          <Text style={styles.price}>{PREMIUM_PRICE_ONCE} einmalig</Text>
          <Text style={styles.priceSub}>+ {PREMIUM_PRICE_MONTHLY} / Monat</Text>
          {PREMIUM.map((t) => (
            <Item key={t} text={t} />
          ))}
        </View>
      </View>

      <Button
        label={isPremium ? "Premium aktiv ✓" : "Jetzt Premium sichern"}
        onPress={buy}
        disabled={isPremium}
      />
      <Text style={styles.cancel}>Jederzeit kündbar</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 20 },
  heroText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  cols: { flexDirection: "row", gap: 12, marginBottom: 22, alignItems: "stretch" },
  colFree: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
  },
  colPremium: {
    flex: 1.1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 14,
    ...Shadow.card,
  },
  colTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text, marginBottom: 8 },
  price: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.primaryDark },
  priceSub: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.primaryDark,
    marginBottom: 10,
  },
  item: { flexDirection: "row", gap: 6, marginBottom: 8 },
  itemText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: Colors.text,
    lineHeight: 16,
  },
  cancel: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
});
