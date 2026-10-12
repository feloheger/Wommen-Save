/**
 * SOS – 5-Sekunden-Countdown (Abbruch möglich, verhindert Fehlalarme), dann Standort + SMS.
 */
import React, { useEffect, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AlertTriangle, CheckCircle2, MapPin, Users } from "lucide-react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SOS_COUNTDOWN_SEC } from "@/constants";
import { runSos } from "@/services/sosService";
import { useSosStore } from "@/store/sosStore";
import { Colors, Fonts, Gradients } from "@/theme";

export const SosScreen: React.FC = () => {
  const { status, result, startCountdown, reset } = useSosStore();
  const [seconds, setSeconds] = useState(SOS_COUNTDOWN_SEC);
  const started = useRef(false);

  // Beim Öffnen: Countdown starten (außer ein SOS läuft schon, z. B. durch Safe Journey)
  useEffect(() => {
    const current = useSosStore.getState().status;
    if (current === "idle" || current === "done") {
      startCountdown();
    }
    return () => {
      const s = useSosStore.getState().status;
      if (s === "countdown" || s === "done") reset();
    };
  }, [startCountdown, reset]);

  useEffect(() => {
    if (status !== "countdown") return;
    setSeconds(SOS_COUNTDOWN_SEC);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "countdown" && seconds === 0 && !started.current) {
      started.current = true;
      void runSos();
    }
    if (status === "idle") started.current = false;
  }, [seconds, status]);

  const close = () => {
    reset();
    router.back();
  };

  return (
    <LinearGradient colors={Gradients.alarm} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          {status === "countdown" && (
            <>
              <View style={styles.circle}>
                <Text style={styles.count}>{seconds}</Text>
              </View>
              <Text style={styles.title}>SOS wird gleich ausgelöst</Text>
              <Text style={styles.text}>
                Dein Standort wird an deine Vertrauenspersonen gesendet. Versehentlich? Dann
                abbrechen.
              </Text>
              <Button label="Abbrechen" variant="soft" onPress={close} style={styles.fullWidth} />
            </>
          )}

          {status === "sending" && (
            <>
              <View style={styles.circle}>
                <AlertTriangle size={44} color={Colors.white} />
              </View>
              <Text style={styles.title}>SOS wird ausgelöst …</Text>
              <Text style={styles.text}>
                Standort wird ermittelt, die Nachricht wird vorbereitet.
              </Text>
            </>
          )}

          {status === "done" && result && (
            <>
              <View style={styles.circle}>
                <CheckCircle2 size={48} color={Colors.white} />
              </View>
              <Text style={styles.title}>SOS vorbereitet</Text>
              <Text style={styles.text}>
                {result.smsComposed
                  ? "Bitte sende die SMS im geöffneten Fenster ab, falls das noch nicht passiert ist."
                  : result.contactCount === 0
                    ? "Du hast noch keine Vertrauenspersonen hinterlegt. Ruf bei Gefahr direkt die 112 an."
                    : "Die SMS wurde nicht gesendet. Ruf bei Gefahr direkt die 112 an."}
              </Text>

              <Card style={styles.info}>
                <MapPin size={18} color={result.location ? Colors.primary : Colors.danger} />
                <Text style={styles.infoText}>
                  {result.location ? "Standort ermittelt" : "Standort nicht verfügbar"}
                </Text>
              </Card>
              <Card style={styles.info}>
                <Users size={18} color={Colors.primary} />
                <Text style={styles.infoText}>
                  {result.contactCount}{" "}
                  {result.contactCount === 1 ? "Vertrauensperson" : "Vertrauenspersonen"} ausgewählt
                </Text>
              </Card>

              <Button
                label="112 anrufen"
                onPress={() => Linking.openURL("tel:112")}
                style={styles.fullWidth}
              />
              <Pressable onPress={close} style={styles.closeLink} accessibilityRole="button">
                <Text style={styles.closeText}>Ich bin in Sicherheit</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  circle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  count: { fontFamily: Fonts.bold, fontSize: 56, color: Colors.white },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: 22,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    marginBottom: 24,
  },
  fullWidth: { alignSelf: "stretch", marginTop: 8 },
  info: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 10,
    paddingVertical: 12,
  },
  infoText: { fontFamily: Fonts.medium, fontSize: 13.5, color: Colors.text, marginLeft: 10 },
  closeLink: { marginTop: 18, padding: 8 },
  closeText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.white,
    textDecorationLine: "underline",
  },
});
