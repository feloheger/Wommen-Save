/**
 * Premium Screen – Übersicht der Premium-Vorteile
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Check, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Button } from "@components/ui/Button";
import { PREMIUM_FEATURES } from "@constants/config";
import { usePremiumStore } from "@store/premiumStore";

export const PremiumScreen: React.FC = () => {
  const { isPremium, setPremium } = usePremiumStore();

  return (
    <ScreenContainer>
      <Pressable
        onPress={() => router.back()}
        className="mt-4 mb-6 h-10 w-10 items-center justify-center rounded-full bg-accent"
      >
        <ArrowLeft size={20} color="#1A1A2E" />
      </Pressable>

      <LinearGradient
        colors={["#7C5CFC", "#B79CFF"]}
        style={{ borderRadius: 24, padding: 24, marginBottom: 24 }}
      >
        <Crown size={36} color="#FFFFFF" />
        <Text className="mt-4 font-poppins-bold text-2xl text-white">Women Save Premium</Text>
        <Text className="mt-2 font-poppins text-sm text-white/90">
          Maximaler Schutz für dich und deine Familie.
        </Text>
      </LinearGradient>

      {PREMIUM_FEATURES.map((feature) => (
        <View key={feature} className="mb-3 flex-row items-center">
          <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-accent">
            <Check size={16} color="#7C5CFC" />
          </View>
          <Text className="flex-1 font-poppins text-sm text-textPrimary">{feature}</Text>
        </View>
      ))}

      <View className="mt-8">
        <Button
          label={isPremium ? "Premium aktiv ✓" : "Jetzt upgraden – 4,99 €/Monat"}
          onPress={() => setPremium(true)}
          disabled={isPremium}
        />
      </View>
    </ScreenContainer>
  );
};
