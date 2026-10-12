/**
 * Fake Call – Anrufer & Verzögerung wählen, dann klingelt es (auch als Benachrichtigung)
 */
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Phone, PhoneOff } from "lucide-react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { FAKE_CALL_DELAYS } from "@/constants";
import { useSecondsUntil } from "@/hooks/useCountdown";
import { cancelScheduled, scheduleAt } from "@/services/notificationService";
import { Colors, Fonts, Radius } from "@/theme";
import { formatClock } from "@/utils/formatters";

const PRESETS = ["Mama", "Freundin", "Papa"];

type Phase = "setup" | "waiting" | "ringing" | "connected";

export const FakeCallScreen: React.FC = () => {
  const [caller, setCaller] = useState(PRESETS[0]);
  const [custom, setCustom] = useState("");
  const [delay, setDelay] = useState<number>(FAKE_CALL_DELAYS[0].seconds);
  const [phase, setPhase] = useState<Phase>("setup");
  const [fireAt, setFireAt] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifId = useRef<string | null>(null);
  const ringer = useRef<ReturnType<typeof setInterval> | null>(null);
  const remaining = useSecondsUntil(phase === "waiting" ? fireAt : null);
  const name = custom.trim() || caller;

  const stopAll = () => {
    if (timer.current) clearTimeout(timer.current);
    if (ringer.current) clearInterval(ringer.current);
    timer.current = null;
    ringer.current = null;
    void cancelScheduled(notifId.current);
    notifId.current = null;
  };

  useEffect(() => stopAll, []);

  const schedule = async () => {
    const at = Date.now() + delay * 1000;
    setFireAt(at);
    setPhase("waiting");
    notifId.current = await scheduleAt(`${name} ruft an`, "Eingehender Anruf", new Date(at));
    timer.current = setTimeout(() => {
      setPhase("ringing");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      ringer.current = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }, 1500);
    }, delay * 1000);
  };

  const end = () => {
    stopAll();
    setPhase("setup");
    setFireAt(null);
  };

  const answer = () => {
    if (ringer.current) clearInterval(ringer.current);
    ringer.current = null;
    setPhase("connected");
  };

  if (phase === "ringing" || phase === "connected") {
    return (
      <LinearGradient colors={["#2A1F2E", "#4B2A45"]} style={styles.flex}>
        <SafeAreaView style={styles.call}>
          <View style={styles.callTop}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.callName}>{name}</Text>
            <Text style={styles.callState}>
              {phase === "ringing" ? "Eingehender Anruf …" : "Verbunden"}
            </Text>
          </View>
          <View style={styles.callActions}>
            <Pressable
              onPress={end}
              style={[styles.circleBtn, { backgroundColor: Colors.danger }]}
              accessibilityLabel="Auflegen"
            >
              <PhoneOff size={28} color={Colors.white} />
            </Pressable>
            {phase === "ringing" && (
              <Pressable
                onPress={answer}
                style={[styles.circleBtn, { backgroundColor: Colors.success }]}
                accessibilityLabel="Annehmen"
              >
                <Phone size={28} color={Colors.white} />
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (phase === "waiting") {
    return (
      <Screen title="Fake Call" back>
        <View style={styles.waiting}>
          <Text style={styles.big}>{formatClock(remaining)}</Text>
          <Text style={styles.hint}>
            {name} ruft gleich an. Du kannst das Display sperren – du bekommst eine
            Benachrichtigung.
          </Text>
          <Button
            label="Abbrechen"
            variant="outline"
            onPress={end}
            style={{ alignSelf: "stretch" }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Fake Call" back>
      <Text style={styles.label}>Wer soll anrufen?</Text>
      <View style={styles.chips}>
        {PRESETS.map((p) => (
          <Pressable
            key={p}
            onPress={() => {
              setCaller(p);
              setCustom("");
            }}
            style={[styles.chip, !custom && caller === p && styles.chipActive]}
          >
            <Text style={[styles.chipText, !custom && caller === p && { color: Colors.white }]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>
      <Input
        label="Oder eigener Name"
        value={custom}
        onChangeText={setCustom}
        placeholder="z. B. Chefin"
      />

      <Text style={styles.label}>Anruf in …</Text>
      <View style={styles.chips}>
        {FAKE_CALL_DELAYS.map((d) => (
          <Pressable
            key={d.seconds}
            onPress={() => setDelay(d.seconds)}
            style={[styles.chip, delay === d.seconds && styles.chipActive]}
          >
            <Text style={[styles.chipText, delay === d.seconds && { color: Colors.white }]}>
              {d.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button label="Anruf starten" onPress={schedule} />
      <Pressable onPress={() => router.back()} style={{ alignItems: "center", marginTop: 14 }}>
        <Text style={styles.hint}>
          Tipp: Schon starten, bevor du in eine unangenehme Situation gerätst.
        </Text>
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 6,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: "#F3D9E2",
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text },
  hint: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  waiting: { alignItems: "center", gap: 18, marginTop: 40 },
  big: { fontFamily: Fonts.bold, fontSize: 56, color: Colors.primary },
  call: { flex: 1, justifyContent: "space-between", paddingVertical: 48 },
  callTop: { alignItems: "center", marginTop: 40 },
  bigAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bigInitial: { fontFamily: Fonts.bold, fontSize: 44, color: Colors.white },
  callName: { fontFamily: Fonts.semibold, fontSize: 26, color: Colors.white },
  callState: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },
  callActions: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 40 },
  circleBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
