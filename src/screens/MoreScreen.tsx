/**
 * Mehr – Einstieg in alle weiteren Bereiche
 */
import React from "react";
import { Linking } from "react-native";
import { router } from "expo-router";
import { BookHeart, Crown, HelpCircle, LayoutGrid, Settings, Siren } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { ListRow } from "@/components/ListRow";
import { SUPPORT_EMAIL } from "@/constants";
import { Colors } from "@/theme";

const I = { size: 20, color: Colors.white } as const;

export const MoreScreen: React.FC = () => (
  <Screen title="Mehr">
    <ListRow
      icon={<LayoutGrid {...I} />}
      title="Funktionen"
      subtitle="Alle Sicherheitsfunktionen"
      onPress={() => router.push("/features")}
    />
    <ListRow
      icon={<Siren {...I} />}
      title="Lauter Alarm"
      subtitle="Sirene, Vibration & Blinken"
      onPress={() => router.push("/alarm")}
    />
    <ListRow
      icon={<BookHeart {...I} />}
      title="Sicherheitstipps"
      subtitle="Für den Alltag"
      onPress={() => router.push("/tips")}
    />
    <ListRow
      icon={<Crown {...I} />}
      title="Premium"
      subtitle="Mehr Funktionen. Mehr Sicherheit."
      onPress={() => router.push("/premium")}
    />
    <ListRow
      icon={<Settings {...I} />}
      title="Einstellungen"
      subtitle="Benachrichtigungen & Datenschutz"
      onPress={() => router.push("/settings")}
    />
    <ListRow
      icon={<HelpCircle {...I} />}
      title="Support"
      subtitle={SUPPORT_EMAIL}
      onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
    />
  </Screen>
);
