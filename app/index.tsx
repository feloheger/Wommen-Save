import { Redirect } from "expo-router";

import { WelcomeScreen } from "@/screens/WelcomeScreen";
import { useSettingsStore } from "@/store/settingsStore";

export default function Index() {
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);
  if (hasOnboarded) return <Redirect href="/(tabs)/home" />;
  return <WelcomeScreen />;
}
