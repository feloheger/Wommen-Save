/**
 * Karte – sichere Orte in der Nähe (OpenStreetMap-Daten), eigene Gefahrenzonen, Standort-Status
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChevronRight, Heart, Search, ShieldCheck, TriangleAlert } from "lucide-react-native";
import { router } from "expo-router";

import { OsmMap, type OsmMarker } from "@/components/OsmMap";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Colors, Fonts, Radius, Shadow } from "@/theme";
import { geocode, getCurrentLocation } from "@/services/locationService";
import { fetchSafePlaces, kindLabel } from "@/services/placesService";
import { shareLocationWithContacts } from "@/services/locationShare";
import { useMapStore } from "@/store/mapStore";
import { useShareStore } from "@/store/shareStore";
import type { LocationPoint, SafePlace } from "@/types";
import { makeId } from "@/utils/formatters";

const FOCUS_ZOOM = 15;

export const MapScreen: React.FC = () => {
  const [center, setCenter] = useState<
    { latitude: number; longitude: number; zoom: number; key: number } | undefined
  >(undefined);
  const [me, setMe] = useState<LocationPoint | null>(null);
  const [places, setPlaces] = useState<SafePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { dangerZones, addDangerZone, removeDangerZone } = useMapStore();
  const { sharedWith } = useShareStore();

  const focus = useCallback((latitude: number, longitude: number) => {
    setCenter((c) => ({ latitude, longitude, zoom: FOCUS_ZOOM, key: (c?.key ?? 0) + 1 }));
  }, []);

  const loadPlaces = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    const found = await fetchSafePlaces(lat, lon);
    setPlaces(found);
    setLoading(false);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const loc = await getCurrentLocation();
      if (!alive) return;
      if (loc) {
        setMe(loc);
        focus(loc.latitude, loc.longitude);
        loadPlaces(loc.latitude, loc.longitude);
      } else {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [loadPlaces, focus]);

  const search = async () => {
    Keyboard.dismiss();
    if (!query.trim()) return;
    const hit = await geocode(query.trim());
    if (!hit) {
      Alert.alert("Ort nicht gefunden", "Bitte versuche eine andere Schreibweise.");
      return;
    }
    focus(hit.latitude, hit.longitude);
    loadPlaces(hit.latitude, hit.longitude);
  };

  const onMapLongPress = (point: { latitude: number; longitude: number }) => {
    Alert.alert("Gefahrenzone markieren?", "Der Punkt wird nur auf deinem Gerät gespeichert.", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Markieren",
        onPress: () =>
          addDangerZone({
            id: makeId(),
            latitude: point.latitude,
            longitude: point.longitude,
            createdAt: Date.now(),
          }),
      },
    ]);
  };

  const onShare = async () => {
    const outcome = await shareLocationWithContacts();
    if (outcome === "no_contacts") {
      Alert.alert("Keine Vertrauenspersonen", "Füge zuerst Vertrauenspersonen hinzu.", [
        { text: "Später", style: "cancel" },
        { text: "Hinzufügen", onPress: () => router.push("/(tabs)/contacts") },
      ]);
    } else if (outcome === "no_location") {
      Alert.alert("Standort nicht verfügbar", "Bitte erlaube den Standortzugriff.");
    }
  };

  const markers = useMemo<OsmMarker[]>(
    () => [
      ...places.map((p) => ({
        id: `place:${p.id}`,
        latitude: p.latitude,
        longitude: p.longitude,
        color: Colors.primary,
        title: p.name,
        subtitle: kindLabel(p.kind),
      })),
      ...dangerZones.map((z) => ({
        id: `zone:${z.id}`,
        latitude: z.latitude,
        longitude: z.longitude,
        color: Colors.danger,
        title: "Gefahrenzone",
        subtitle: "Antippen zum Entfernen",
      })),
    ],
    [places, dangerZones],
  );

  const onMarkerPress = (id: string) => {
    if (!id.startsWith("zone:")) return;
    const zoneId = id.slice(5);
    Alert.alert("Gefahrenzone entfernen?", undefined, [
      { text: "Abbrechen", style: "cancel" },
      { text: "Entfernen", style: "destructive", onPress: () => removeDangerZone(zoneId) },
    ]);
  };

  return (
    <Screen title="Sichere Orte in deiner Nähe" scroll={false} contentStyle={{ paddingBottom: 12 }}>
      <View style={styles.search}>
        <Search size={18} color={Colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
          placeholder="Ort suchen …"
          placeholderTextColor={Colors.placeholder}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.mapWrap}>
        <OsmMap
          center={center}
          user={me}
          accuracyMeters={150}
          markers={markers}
          onLongPress={onMapLongPress}
          onMarkerPress={onMarkerPress}
        />

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        )}

        <Card style={styles.legend}>
          <LegendRow color={Colors.primary} label="Sicherer Ort" />
          <LegendRow color={Colors.danger} label="Gefahrenzone" />
          <LegendRow color="#2F7DE1" label="Deine Position" round />
          <Text style={styles.legendHint}>
            Lange auf die Karte tippen, um eine Gefahrenzone zu markieren.
          </Text>
        </Card>
      </View>

      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel="Dein Standort teilen"
      >
        <Card style={styles.bottomCard}>
          <View style={styles.bottomIcon}>
            <ShieldCheck size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomTitle}>Dein Standort</Text>
            <Text style={styles.bottomSub}>
              {sharedWith > 0
                ? `Zuletzt geteilt mit ${sharedWith} ${sharedWith === 1 ? "Person" : "Personen"}`
                : "Noch nicht geteilt – tippen zum Teilen"}
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </Card>
      </Pressable>
    </Screen>
  );
};

const LegendRow: React.FC<{ color: string; label: string; round?: boolean }> = ({
  color,
  label,
  round,
}) => (
  <View style={styles.legendRow}>
    <View
      style={[
        styles.legendDot,
        { backgroundColor: color },
        round && { borderWidth: 2, borderColor: Colors.white },
      ]}
    />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    marginBottom: 12,
    ...Shadow.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.text,
  },
  mapWrap: {
    flex: 1,
    borderRadius: Radius.md,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: Colors.bgDeep,
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  loading: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 6,
  },
  legend: { position: "absolute", left: 10, bottom: 10, padding: 10, maxWidth: 190 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.text },
  legendHint: { fontFamily: Fonts.regular, fontSize: 9.5, color: Colors.textMuted, marginTop: 2 },
  bottomCard: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  bottomIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bottomTitle: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  bottomSub: { fontFamily: Fonts.regular, fontSize: 11.5, color: Colors.textMuted },
});
