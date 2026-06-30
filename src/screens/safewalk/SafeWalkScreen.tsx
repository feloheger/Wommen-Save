/**
 * Safe Walk Screen – Heimweg starten, Live-Tracking, Timer, Check-in
 */
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Footprints, Clock, ShieldCheck } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { useSafeWalk } from "@hooks/useSafeWalk";
import { formatDuration } from "@utils/formatters";

const DURATIONS = [5, 10, 15, 30];

export const SafeWalkScreen: React.FC = () => {
  const { status, destination: activeDestination, route, begin, confirmCheckIn, finish } =
    useSafeWalk();
  const [destinationInput, setDestinationInput] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState(15);

  const lastPoint = route[route.length - 1];

  if (status === "idle" || status === "completed") {
    return (
      <ScreenContainer>
        <View className="mt-6 mb-6 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <Footprints size={32} color="#7C5CFC" />
          </View>
          <Text className="font-poppins-bold text-2xl text-textPrimary">Safe Walk</Text>
          <Text className="mt-2 text-center font-poppins text-sm text-textSecondary">
            Lass dich auf deinem Heimweg live begleiten. Bestätigst du nicht rechtzeitig, wird
            automatisch ein Notruf ausgelöst.
          </Text>
        </View>

        <Input
          label="Ziel"
          placeholder="z. B. Zuhause"
          value={destinationInput}
          onChangeText={setDestinationInput}
        />

        <Text className="mb-3 font-poppins-medium text-sm text-textPrimary">Geschätzte Dauer</Text>
        <View className="mb-8 flex-row flex-wrap gap-3">
          {DURATIONS.map((min) => (
            <Pressable
              key={min}
              onPress={() => setSelectedMinutes(min)}
              className={`rounded-xl px-4 py-3 ${
                selectedMinutes === min ? "bg-primary" : "bg-accent"
              }`}
            >
              <Text
                className={`font-poppins-medium text-sm ${
                  selectedMinutes === min ? "text-white" : "text-textPrimary"
                }`}
              >
                {min} Min
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          label="Safe Walk starten"
          onPress={() => begin(destinationInput || "Unbekanntes Ziel", selectedMinutes)}
          disabled={!destinationInput}
        />
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View style={{ height: "55%" }}>
        {lastPoint ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: lastPoint.latitude,
              longitude: lastPoint.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={lastPoint} title="Aktueller Standort" />
            <Polyline
              coordinates={route.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
              strokeColor="#7C5CFC"
              strokeWidth={4}
            />
          </MapView>
        ) : (
          <View className="flex-1 items-center justify-center bg-accent">
            <Text className="font-poppins text-sm text-textSecondary">
              Standort wird ermittelt…
            </Text>
          </View>
        )}
      </View>

      <ScreenContainer scroll={false} className="-mt-6">
        <Card className="mb-4">
          <Text className="mb-1 font-poppins-semibold text-base text-textPrimary">
            Ziel: {activeDestination}
          </Text>
          <View className="flex-row items-center">
            <Clock size={16} color="#6B6B85" />
            <Text className="ml-2 font-poppins text-xs text-textSecondary">
              Live-Tracking aktiv
            </Text>
          </View>
        </Card>

        {status === "checkin_pending" && (
          <Card className="mb-4 border border-warning bg-accent">
            <Text className="mb-3 text-center font-poppins-semibold text-sm text-textPrimary">
              Bist du sicher angekommen?
            </Text>
            <Button label="Ja, mir geht es gut" onPress={confirmCheckIn} />
          </Card>
        )}

        {status === "alert" && (
          <Card className="mb-4 border border-danger bg-accent">
            <Text className="text-center font-poppins-semibold text-sm text-danger">
              Kein Check-in erfolgt – Notruf wurde automatisch ausgelöst.
            </Text>
          </Card>
        )}

        <Button label="Safe Walk beenden" variant="outline" onPress={finish} />

        <View className="mt-4 flex-row items-center justify-center">
          <ShieldCheck size={14} color="#34C77B" />
          <Text className="ml-2 font-poppins text-xs text-textSecondary">
            {formatDuration(route.length * 5)} seit Start verfolgt
          </Text>
        </View>
      </ScreenContainer>
    </View>
  );
};
