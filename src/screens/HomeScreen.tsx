/**
 * Home – Begrüßung, großer SOS-Button und vier Schnellzugriffe (wie im Mockup)
 */
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BookHeart, Flower2, MapPin, PhoneCall, Settings } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Logo } from "@/components/Logo";
import { Colors, Fonts, Gradients } from "@/theme";
import { shareLocationWithContacts } from "@/services/locationShare";

interface TileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const Tile: React.FC<TileProps> = ({ icon, title, subtitle, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${title}, ${subtitle}`}
    style={({ pressed }) => [styles.tileWrap, pressed && { opacity: 0.85 }]}
  >
    <Card style={styles.tile}>
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSub}>{subtitle}</Text>
    </Card>
  </Pressable>
);

export const HomeScreen: React.FC = () => {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.04, { duration: 1100 }), withTiming(1, { duration: 1100 })),
      -1,
      false,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const openSos = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    router.push("/sos");
  };

  const shareLocation = async () => {
    const outcome = await shareLocationWithContacts();
    if (outcome === "no_contacts") {
      Alert.alert(
        "Keine Vertrauenspersonen",
        "Füge zuerst mindestens eine Vertrauensperson hinzu.",
        [
          { text: "Später", style: "cancel" },
          { text: "Hinzufügen", onPress: () => router.push("/(tabs)/contacts") },
        ],
      );
    } else if (outcome === "no_location") {
      Alert.alert(
        "Standort nicht verfügbar",
        "Bitte erlaube den Standortzugriff in den Einstellungen.",
      );
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hallo, schön, dass{"\n"}du da bist! <Text style={{ color: Colors.primaryLight }}>♥</Text>
        </Text>
        <Pressable
          onPress={() => router.push("/settings")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Einstellungen"
        >
          <Settings size={22} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.sosArea}>
        <Animated.View style={pulseStyle}>
          <Pressable
            onPress={openSos}
            accessibilityRole="button"
            accessibilityLabel="SOS Panik-Modus, Hilfe auf Knopfdruck"
          >
            <LinearGradient colors={Gradients.sos} style={styles.sos}>
              <View style={styles.sosRing}>
                <Logo size={30} />
                <Text style={styles.sosLabel}>SOS</Text>
                <Text style={styles.sosTitle}>Panik-Modus</Text>
                <Text style={styles.sosSub}>Hilfe auf Knopfdruck</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.grid}>
        <Tile
          icon={<MapPin size={26} color={Colors.primary} />}
          title="Standort teilen"
          subtitle="Mit Vertrauenspersonen"
          onPress={shareLocation}
        />
        <Tile
          icon={<Flower2 size={26} color={Colors.primary} />}
          title="Self-Care-Modus"
          subtitle="Bei Angst & Panik"
          onPress={() => router.push("/self-care")}
        />
        <Tile
          icon={<PhoneCall size={26} color={Colors.primary} />}
          title="Fake Call"
          subtitle="Diskret Hilfe holen"
          onPress={() => router.push("/fake-call")}
        />
        <Tile
          icon={<BookHeart size={26} color={Colors.primary} />}
          title="Sicherheitstipps"
          subtitle="Für den Alltag"
          onPress={() => router.push("/tips")}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 16,
  },
  greeting: { fontFamily: Fonts.regular, fontSize: 21, lineHeight: 30, color: Colors.text },
  sosArea: { alignItems: "center", marginVertical: 22 },
  sos: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  sosRing: {
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosLabel: { fontFamily: Fonts.semibold, fontSize: 30, color: Colors.white, marginTop: 2 },
  sosTitle: { fontFamily: Fonts.medium, fontSize: 15, color: Colors.white },
  sosSub: { fontFamily: Fonts.regular, fontSize: 11, color: "rgba(255,255,255,0.9)" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tileWrap: { width: "48%", marginBottom: 14 },
  tile: { alignItems: "center", paddingVertical: 18, paddingHorizontal: 8 },
  tileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F6DDE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tileTitle: { fontFamily: Fonts.medium, fontSize: 13.5, color: Colors.text, textAlign: "center" },
  tileSub: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
});
