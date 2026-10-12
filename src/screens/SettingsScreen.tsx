import React from "react";
import { Alert, Linking, Switch } from "react-native";
import { Bell, Shield, Trash2, FileText } from "lucide-react-native";

import { Screen } from "@/components/Screen";
import { ListRow } from "@/components/ListRow";
import { PRIVACY_URL, TERMS_URL } from "@/constants";
import { useContactsStore } from "@/store/contactsStore";
import { useMapStore } from "@/store/mapStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Colors } from "@/theme";

const I = { size: 20, color: Colors.white } as const;

export const SettingsScreen: React.FC = () => {
  const { notificationsEnabled, setNotificationsEnabled } = useSettingsStore();

  const deleteAll = () =>
    Alert.alert(
      "Alle Daten löschen?",
      "Vertrauenspersonen und markierte Gefahrenzonen werden von diesem Gerät entfernt.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: () => {
            useContactsStore.setState({ contacts: [] });
            useMapStore.setState({ dangerZones: [] });
          },
        },
      ],
    );

  return (
    <Screen title="Einstellungen" back>
      <ListRow
        icon={<Bell {...I} />}
        title="Benachrichtigungen"
        subtitle="Check-ins & Fake-Call-Hinweise"
        right={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ true: Colors.primary, false: "#E3D3D9" }}
          />
        }
      />
      <ListRow
        icon={<Shield {...I} />}
        title="Datenschutz"
        onPress={() => Linking.openURL(PRIVACY_URL)}
      />
      <ListRow
        icon={<FileText {...I} />}
        title="Nutzungsbedingungen"
        onPress={() => Linking.openURL(TERMS_URL)}
      />
      <ListRow
        icon={<Trash2 {...I} />}
        tone="danger"
        title="Alle Daten löschen"
        subtitle="Nur auf diesem Gerät gespeichert"
        onPress={deleteAll}
      />
    </Screen>
  );
};
