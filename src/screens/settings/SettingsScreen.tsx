/**
 * Einstellungen Screen – Supabase statt Firebase für Logout
 */
import React from "react";
import { View, Text, Switch, Pressable, Linking } from "react-native";
import { router } from "expo-router";
import {
  Moon,
  Globe,
  Shield,
  Bell,
  User,
  Crown,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Card } from "@components/ui/Card";
import { useSettingsStore } from "@store/settingsStore";
import { logoutUser } from "@supabaseConfig/authService";
import { SUPPORT_EMAIL, PRIVACY_URL } from "@constants/config";

interface RowProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

const SettingsRow: React.FC<RowProps> = ({ icon, label, right, onPress }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between border-b border-border py-4 last:border-b-0"
  >
    <View className="flex-row items-center">
      <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-accent">
        {icon}
      </View>
      <Text className="font-poppins-medium text-sm text-textPrimary">{label}</Text>
    </View>
    {right ?? <ChevronRight size={18} color="#A0A0B8" />}
  </Pressable>
);

export const SettingsScreen: React.FC = () => {
  const {
    darkMode,
    notificationsEnabled,
    language,
    setDarkMode,
    setNotificationsEnabled,
    setLanguage,
  } = useSettingsStore();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/(auth)/login");
  };

  return (
    <ScreenContainer>
      <Text className="mt-4 mb-6 font-poppins-bold text-2xl text-textPrimary">Einstellungen</Text>

      <Card className="mb-4">
        <SettingsRow
          icon={<Moon size={18} color="#7C5CFC" />}
          label="Dark Mode"
          right={<Switch value={darkMode} onValueChange={setDarkMode} />}
        />
        <SettingsRow
          icon={<Globe size={18} color="#7C5CFC" />}
          label={`Sprache (${language === "de" ? "Deutsch" : "English"})`}
          onPress={() => setLanguage(language === "de" ? "en" : "de")}
        />
        <SettingsRow
          icon={<Bell size={18} color="#7C5CFC" />}
          label="Benachrichtigungen"
          right={<Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
        />
      </Card>

      <Card className="mb-4">
        <SettingsRow
          icon={<User size={18} color="#7C5CFC" />}
          label="Kontoverwaltung"
          onPress={() => {}}
        />
        <SettingsRow
          icon={<Shield size={18} color="#7C5CFC" />}
          label="Datenschutz"
          onPress={() => Linking.openURL(PRIVACY_URL)}
        />
        <SettingsRow
          icon={<Crown size={18} color="#7C5CFC" />}
          label="Premium"
          onPress={() => router.push("/premium")}
        />
        <SettingsRow
          icon={<HelpCircle size={18} color="#7C5CFC" />}
          label="Support"
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
        />
      </Card>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-center rounded-2xl bg-accent py-4"
      >
        <LogOut size={18} color="#FF4D6A" />
        <Text className="ml-2 font-poppins-semibold text-sm text-danger">Abmelden</Text>
      </Pressable>
    </ScreenContainer>
  );
};
