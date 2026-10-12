/**
 * Funktionen – Übersicht aller Sicherheitsfunktionen
 */
import React from "react";
import { Alert, Linking } from "react-native";
import { router } from "expo-router";
import {
  AlertTriangle,
  Flower2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Watch,
} from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { ListRow } from "@/components/ListRow";
import { shareLocationWithContacts } from "@/services/locationShare";
import { Colors } from "@/theme";

const I = { size: 20, color: Colors.white } as const;

export const FeaturesScreen: React.FC = () => {
  const shareLocation = async () => {
    const outcome = await shareLocationWithContacts();
    if (outcome === "no_contacts")
      Alert.alert("Keine Vertrauenspersonen", "Füge zuerst Vertrauenspersonen hinzu.");
    if (outcome === "no_location")
      Alert.alert("Standort nicht verfügbar", "Bitte erlaube den Standortzugriff.");
  };

  return (
    <Screen title="Funktionen" back>
      <ListRow
        icon={<Phone {...I} />}
        title="Notruf"
        subtitle="Direkt die 112 anrufen"
        onPress={() => Linking.openURL("tel:112")}
      />
      <ListRow
        icon={<MapPin {...I} />}
        title="Standort teilen"
        subtitle="Live-Standort & Check-ins"
        onPress={shareLocation}
      />
      <ListRow
        icon={<MapIcon {...I} />}
        title="Sicherheitskarte"
        subtitle="Sichere Orte & Gefahrenzonen"
        onPress={() => router.push("/(tabs)/map")}
      />
      <ListRow
        icon={<Navigation {...I} />}
        title="Safe-Journey-Modus"
        subtitle="Begleitung auf dem Heimweg"
        onPress={() => router.push("/safe-journey")}
      />
      <ListRow
        icon={<PhoneCall {...I} />}
        title="Fake Call"
        subtitle="Simulierter Anruf"
        onPress={() => router.push("/fake-call")}
      />
      <ListRow
        icon={<AlertTriangle {...I} />}
        title="Sicherheitswarnungen"
        subtitle="Aktuelle Gefahren & Hinweise"
        onPress={() => router.push("/warnings")}
      />
      <ListRow
        icon={<Flower2 {...I} />}
        title="Self-Care-Modus"
        subtitle="Atemübungen & Tipps"
        onPress={() => router.push("/self-care")}
      />
      <ListRow
        icon={<Watch {...I} />}
        title="Smartwatch-Anbindung"
        subtitle="SOS, Standort & mehr"
        onPress={() => router.push("/smartwatch")}
      />
    </Screen>
  );
};
