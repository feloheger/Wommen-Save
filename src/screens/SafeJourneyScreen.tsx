/**
 * Safe-Journey-Modus – Heimweg mit Timer, Live-Route und Check-in.
 * Läuft nicht bei Ablauf des Timers in der App-Komponente, sondern im journeyService.
 */
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clock, Navigation, ShieldCheck } from "lucide-react-native";
import { router } from "expo-router";

import { OsmMap } from "@/components/OsmMap";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { JOURNEY_DURATIONS_MIN } from "@/constants";
import { useSecondsUntil } from "@/hooks/useCountdown";
import { confirmArrived, endJourney, extendJourney, startJourney } from "@/services/journeyService";
import { requestLocationPermission, watchLocation } from "@/services/locationService";
import { useJourneyStore } from "@/store/journeyStore";
import { useSosStore } from "@/store/sosStore";
import { Colors, Fonts, Radius } from "@/theme";
import { formatClock } from "@/utils/formatters";

export const SafeJourneyScreen: React.FC = () => {
  const { status, destination, endsAt, graceEndsAt, route, addRoutePoint } = useJourneyStore();
  const sosStatus = useSosStore((s) => s.status);
  const [input, setInput] = useState("");
  const [minutes, setMinutes] = useState<number>(15);
  const remaining = useSecondsUntil(status === "active" ? endsAt : null);
  const grace = useSecondsUntil(status === "checkin_pending" ? graceEndsAt : null);

  // Live-Tracking nur, solange der Screen offen ist und die Reise läuft
  useEffect(() => {
    if (status !== "active" && status !== "checkin_pending") return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      if (!(await requestLocationPermission())) return;
      const s = await watchLocation(addRoutePoint);
      if (cancelled) s.remove();
      else sub = s;
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [status, addRoutePoint]);

  const last = route[route.length - 1];

  if (status === "idle") {
    return (
      <Screen title="Safe-Journey-Modus" back>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Navigation size={30} color={Colors.primary} />
          </View>
          <Text style={styles.lead}>
            Lass dich auf dem Heimweg begleiten. Bestätigst du deine Ankunft nicht rechtzeitig, wird
            ein SOS vorbereitet.
          </Text>
        </View>

        <Input label="Ziel" placeholder="z. B. Zuhause" value={input} onChangeText={setInput} />

        <Text style={styles.label}>Geschätzte Dauer</Text>
        <View style={styles.chips}>
          {JOURNEY_DURATIONS_MIN.map((m) => (
            <Pressable
              key={m}
              onPress={() => setMinutes(m)}
              accessibilityRole="button"
              accessibilityState={{ selected: minutes === m }}
              style={[styles.chip, minutes === m && styles.chipActive]}
            >
              <Text style={[styles.chipText, minutes === m && { color: Colors.white }]}>
                {m} Min
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          label="Safe Journey starten"
          disabled={!input.trim()}
          onPress={() => startJourney(input.trim(), minutes)}
        />
      </Screen>
    );
  }

  return (
    <Screen title="Safe-Journey-Modus" back scroll={false}>
      <View style={styles.mapBox}>
        {last ? (
          <OsmMap
            center={{
              latitude: last.latitude,
              longitude: last.longitude,
              zoom: 16,
              key: route.length,
            }}
            user={last}
            line={route}
          />
        ) : (
          <View style={styles.mapWait}>
            <Text style={styles.sub}>Standort wird ermittelt …</Text>
          </View>
        )}
      </View>

      <Card style={{ marginBottom: 12 }}>
        <Text style={styles.dest}>Ziel: {destination}</Text>
        <View style={styles.row}>
          <Clock size={16} color={Colors.textMuted} />
          <Text style={styles.sub}>
            {status === "active" && `Noch ${formatClock(remaining)} bis zum Check-in`}
            {status === "checkin_pending" && `Bitte bestätigen – SOS in ${formatClock(grace)}`}
            {status === "alert" && "SOS wurde ausgelöst"}
          </Text>
        </View>
      </Card>

      {status === "checkin_pending" && (
        <Card style={styles.warnCard}>
          <Text style={styles.warnTitle}>Bist du sicher angekommen?</Text>
          <Button label="Ja, mir geht es gut" onPress={confirmArrived} />
          <View style={{ height: 8 }} />
          <Button
            label="Noch unterwegs (+10 Min)"
            variant="outline"
            onPress={() => extendJourney(10)}
          />
        </Card>
      )}

      {status === "alert" && (
        <Card style={styles.warnCard}>
          <Text style={[styles.warnTitle, { color: Colors.danger }]}>
            Kein Check-in erfolgt – SOS {sosStatus === "done" ? "vorbereitet" : "wird vorbereitet"}.
          </Text>
          <Button label="SOS-Status ansehen" onPress={() => router.push("/sos")} />
        </Card>
      )}

      {status === "active" && (
        <View style={styles.row}>
          <ShieldCheck size={14} color={Colors.success} />
          <Text style={styles.sub}>Live-Tracking aktiv, solange diese Ansicht geöffnet ist</Text>
        </View>
      )}

      <View style={{ flex: 1 }} />
      <Button label="Safe Journey beenden" variant="outline" onPress={endJourney} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginVertical: 16 },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F6DDE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  lead: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  label: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: "#F3D9E2",
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text },
  mapBox: {
    height: 260,
    borderRadius: Radius.md,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: Colors.bgDeep,
  },
  mapWait: { flex: 1, alignItems: "center", justifyContent: "center" },
  dest: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  sub: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textMuted },
  warnCard: { marginBottom: 12, borderColor: Colors.warning },
  warnTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
});
