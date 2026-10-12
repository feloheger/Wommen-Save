/**
 * Willkommens-/Splash-Screen
 */
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Logo } from "@/components/Logo";
import { Colors, Fonts, Gradients, Radius } from "@/theme";
import { useSettingsStore } from "@/store/settingsStore";

export const WelcomeScreen: React.FC = () => {
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const start = () => {
    completeOnboarding();
    router.replace("/(tabs)/home");
  };

  return (
    <LinearGradient colors={Gradients.splash} style={styles.flex}>
      <View style={styles.sun} />
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Logo size={92} />
          <Text style={styles.brand}>WOMEN SAVE</Text>
          <Text style={styles.tagline}>Sicher. Stark. Selbstbewusst.</Text>
        </View>

        <View style={styles.bottom}>
          <Pressable
            onPress={start}
            accessibilityRole="button"
            accessibilityLabel="Los geht's"
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.ctaLabel}>Los geht&apos;s</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Kein Konto nötig",
                "Women Save funktioniert ohne Anmeldung – deine Daten bleiben auf deinem Gerät.",
              )
            }
            hitSlop={10}
          >
            <Text style={styles.login}>
              Schon ein Konto? <Text style={styles.loginLink}>Anmelden</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sun: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(255, 190, 200, 0.22)",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  brand: {
    marginTop: 20,
    fontFamily: Fonts.semibold,
    fontSize: 32,
    letterSpacing: 2,
    color: Colors.white,
  },
  tagline: {
    marginTop: 6,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },
  bottom: { paddingHorizontal: 22, paddingBottom: 24, alignItems: "center", gap: 18 },
  cta: {
    width: "100%",
    height: 54,
    borderRadius: Radius.pill,
    backgroundColor: "#F3D2DE",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLabel: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.primaryDark },
  login: { fontFamily: Fonts.regular, fontSize: 13, color: "rgba(255,255,255,0.9)" },
  loginLink: { textDecorationLine: "underline" },
});
