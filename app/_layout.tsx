import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

<<<<<<< HEAD
import { useStoreHydrated } from "@/hooks/useStoreHydrated";
=======
import { useSettingsStore } from "@store/settingsStore";
import "../src/styles/global.css";
>>>>>>> a4f96678eab6b731130c94eee79ed2eb4b7db73b

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
<<<<<<< HEAD
  const hydrated = useStoreHydrated();
  // Bei Font-Fehler trotzdem starten (Systemschrift), statt ewig im Splash zu hängen
  const ready = (fontsLoaded || !!fontError) && hydrated;
=======

  const hydrateSettings = useSettingsStore((s) => s.hydrate);
>>>>>>> a4f96678eab6b731130c94eee79ed2eb4b7db73b

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

<<<<<<< HEAD
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FBF1F1" } }}>
          <Stack.Screen name="index" />
=======
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
>>>>>>> a4f96678eab6b731130c94eee79ed2eb4b7db73b
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="sos"
            options={{ presentation: "fullScreenModal", gestureEnabled: false }}
          />
          <Stack.Screen name="alarm" options={{ presentation: "fullScreenModal" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}