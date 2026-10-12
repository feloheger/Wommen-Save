/**
 * Tab-Navigation – Home, Karte, Kontakte, Mehr (wie im Mockup)
 */
import React from "react";
import { Tabs } from "expo-router";
import { Home, MapPin, Menu, Users } from "lucide-react-native";

import { Colors, Fonts } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.cardBorder,
          height: 66,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontFamily: Fonts.medium, fontSize: 10.5 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ color }) => <Home color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: "Karte", tabBarIcon: ({ color }) => <MapPin color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Kontakte",
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "Mehr", tabBarIcon: ({ color }) => <Menu color={color} size={22} /> }}
      />
    </Tabs>
  );
}
