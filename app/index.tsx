import { Redirect } from "expo-router";
<<<<<<< HEAD

import { WelcomeScreen } from "@/screens/WelcomeScreen";
import { useSettingsStore } from "@/store/settingsStore";

export default function Index() {
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);
  if (hasOnboarded) return <Redirect href="/(tabs)/home" />;
  return <WelcomeScreen />;
}
=======

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
>>>>>>> a4f96678eab6b731130c94eee79ed2eb4b7db73b
