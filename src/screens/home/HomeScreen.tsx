/**
 * Home Screen – Begrüßung, SOS-Button, Feature-Cards, Premium-Banner
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Footprints, MapPin, BellRing, PhoneCall, Siren } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { FeatureCard } from "@components/cards/FeatureCard";
import { PremiumBanner } from "@components/cards/PremiumBanner";
import { useAuthStore } from "@store/authStore";
import { Colors } from "@constants/colors";

export const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const handleSos = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    router.push("/sos");
  };

  return (
    <ScreenContainer>
      <View className="mt-4 mb-6 flex-row items-center justify-between">
        <View>
          <Text className="font-poppins text-sm text-textSecondary">Hallo,</Text>
          <Text className="font-poppins-bold text-2xl text-textPrimary">
            {user?.name ?? "Nutzerin"} 👋
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          className="h-12 w-12 items-center justify-center rounded-full bg-accent"
        >
          <Text className="font-poppins-semibold text-base text-primary">
            {(user?.name ?? "U").charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      {/* Großer SOS Button */}
      <View className="mb-8 items-center">
        <Animated.View style={pulseStyle}>
          <Pressable onPress={handleSos}>
            <LinearGradient
              colors={["#FF4D6A", "#FF7A93"]}
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Siren size={48} color="#FFFFFF" />
              <Text className="mt-2 font-poppins-bold text-xl text-white">SOS</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
        <Text className="mt-4 font-poppins text-xs text-textSecondary">
          Halte gedrückt oder tippe im Notfall
        </Text>
      </View>

      <PremiumBanner />

      <Text className="mb-4 font-poppins-semibold text-base text-textPrimary">
        Deine Sicherheits-Tools
      </Text>

      <View className="flex-row flex-wrap justify-between">
        <FeatureCard
          title="Safe Walk"
          subtitle="Live-Begleitung nach Hause"
          icon={<Footprints size={22} color={Colors.primary} />}
          color={Colors.primary}
          onPress={() => router.push("/safe-walk")}
        />
        <FeatureCard
          title="Live Standort"
          subtitle="Teile deinen Standort"
          icon={<MapPin size={22} color={Colors.success} />}
          color={Colors.success}
          onPress={() => router.push("/safe-walk")}
        />
        <FeatureCard
          title="Alarm"
          subtitle="Lauter Sirenen-Alarm"
          icon={<BellRing size={22} color={Colors.warning} />}
          color={Colors.warning}
          onPress={() => router.push("/alarm")}
        />
        <FeatureCard
          title="Fake Call"
          subtitle="Simulierter Anruf"
          icon={<PhoneCall size={22} color={Colors.secondary} />}
          color={Colors.secondary}
          onPress={() => router.push("/fake-call")}
        />
        <FeatureCard
          title="Notruf"
          subtitle="Direkt SOS auslösen"
          icon={<Siren size={22} color={Colors.danger} />}
          color={Colors.danger}
          onPress={handleSos}
        />
      </View>
    </ScreenContainer>
  );
};
