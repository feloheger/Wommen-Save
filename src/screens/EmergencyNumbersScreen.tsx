import React from "react";
import { Linking } from "react-native";
import { Phone } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { ListRow } from "@/components/ListRow";
import { EMERGENCY_NUMBERS } from "@/data/emergencyNumbers";
import { Colors } from "@/theme";

export const EmergencyNumbersScreen: React.FC = () => (
  <Screen title="Hilfsnummern" back>
    {EMERGENCY_NUMBERS.map((n) => (
      <ListRow
        key={n.id}
        icon={<Phone size={20} color={Colors.white} />}
        tone={n.id === "112" || n.id === "110" ? "danger" : "default"}
        title={`${n.name} · ${n.number.replace(/^(116)(\d{3})$/, "$1 $2")}`}
        subtitle={n.description}
        onPress={() => Linking.openURL(`tel:${n.number}`)}
      />
    ))}
  </Screen>
);
