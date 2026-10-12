/**
 * Self-Care-Modus – geführte Atemübung (4-4-6) und Erdungsübung bei Angst & Panik
 */
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Colors, Fonts } from "@/theme";

const PHASES = [
  { label: "Einatmen", seconds: 4, scale: 1.0 },
  { label: "Halten", seconds: 4, scale: 1.0 },
  { label: "Ausatmen", seconds: 6, scale: 0.55 },
] as const;

export const SelfCareScreen: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const scale = useSharedValue(0.55);

  useEffect(() => {
    if (!running) {
      scale.value = withTiming(0.55, { duration: 400 });
      setPhaseIndex(0);
      return;
    }
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      const phase = PHASES[idx];
      setPhaseIndex(idx);
      scale.value = withTiming(phase.scale, {
        duration: phase.seconds * 1000,
        easing: Easing.inOut(Easing.ease),
      });
      timer = setTimeout(() => {
        idx = (idx + 1) % PHASES.length;
        run();
      }, phase.seconds * 1000);
    };
    run();
    return () => clearTimeout(timer);
  }, [running, scale]);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Screen title="Self-Care-Modus" back>
      <Text style={styles.lead}>Du bist nicht allein. Atme mit – langsam und gleichmäßig.</Text>

      <View style={styles.stage}>
        <Animated.View style={[styles.circle, circleStyle]} />
        <Text style={styles.phase}>{running ? PHASES[phaseIndex].label : "Bereit?"}</Text>
      </View>

      <Button
        label={running ? "Beenden" : "Atemübung starten"}
        onPress={() => setRunning((r) => !r)}
      />

      <Card style={{ marginTop: 22 }}>
        <Text style={styles.cardTitle}>5-4-3-2-1 – zurück ins Hier und Jetzt</Text>
        <Text style={styles.cardText}>
          Nenne 5 Dinge, die du siehst · 4, die du fühlst · 3, die du hörst · 2, die du riechst · 1,
          das du schmecken kannst.
        </Text>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.cardTitle}>Wenn es zu viel wird</Text>
        <Text style={styles.cardText}>
          Ruf eine Vertrauensperson an oder wende dich an die Telefonseelsorge: 0800 111 0 111
          (kostenlos, rund um die Uhr). Bei akuter Gefahr: 112.
        </Text>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  lead: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginVertical: 12,
  },
  stage: { height: 260, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  circle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(139,58,98,0.22)",
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  phase: { fontFamily: Fonts.semibold, fontSize: 22, color: Colors.primaryDark },
  cardTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text, marginBottom: 4 },
  cardText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
});
