/**
 * Premium-Werbebanner mit Gradient für den Home Screen
 */
import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Crown } from "lucide-react-native";
import { router } from "expo-router";

export const PremiumBanner: React.FC = () => {
  return (
    <Pressable onPress={() => router.push("/premium")} className="mb-6 w-full">
      <LinearGradient
        colors={["#7C5CFC", "#B79CFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="mb-2 flex-row items-center">
              <Crown size={18} color="#FFFFFF" />
              <Text className="ml-2 font-poppins-semibold text-sm text-white">
                Women Save Premium
              </Text>
            </View>
            <Text className="font-poppins text-xs text-white/90">
              Unbegrenzte Kontakte, Safe Walk+ und automatische Gefahrenzonen-Erkennung.
            </Text>
          </View>
          <View className="rounded-full bg-white/20 px-4 py-2">
            <Text className="font-poppins-semibold text-xs text-white">Upgrade</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
