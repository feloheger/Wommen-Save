/**
 * SOS Screen – Standort, Nachricht, Vertrauenspersonen, Alarm
 */
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { X, CheckCircle2, MapPin, Users } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { useSos } from "@hooks/useSos";
import { useContactsStore } from "@store/contactsStore";

export const SosScreen: React.FC = () => {
  const { status, startSos, cancelSos, resolveSos } = useSos();
  const { contacts } = useContactsStore();
  const [sending, setSending] = useState(false);
  const favoriteCount = contacts.filter((c) => c.isFavorite).length || contacts.length;

  useEffect(() => {
    const trigger = async () => {
      setSending(true);
      await startSos();
      setSending(false);
    };
    trigger();
    // Nur einmal beim Betreten des Screens auslösen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = () => {
    cancelSos();
    router.back();
  };

  const handleResolve = () => {
    resolveSos();
    router.back();
  };

  return (
    <LinearGradient colors={["#FF4D6A", "#7C5CFC"]} style={{ flex: 1 }}>
      <ScreenContainer scroll={false} className="bg-transparent">
        <View className="flex-1 items-center justify-center px-4">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white/20">
            {sending ? (
              <Text className="font-poppins-bold text-3xl text-white">!</Text>
            ) : (
              <CheckCircle2 size={48} color="#FFFFFF" />
            )}
          </View>

          <Text className="mb-2 text-center font-poppins-bold text-2xl text-white">
            {sending ? "SOS wird ausgelöst…" : "SOS wurde ausgelöst"}
          </Text>
          <Text className="mb-8 text-center font-poppins text-sm text-white/90">
            {sending
              ? "Standort wird abgerufen und Vertrauenspersonen werden benachrichtigt."
              : "Deine Vertrauenspersonen wurden über deinen Standort informiert."}
          </Text>

          <Card className="mb-4 w-full bg-white/95">
            <View className="flex-row items-center">
              <MapPin size={20} color="#7C5CFC" />
              <Text className="ml-3 font-poppins-medium text-sm text-textPrimary">
                Standort wurde geteilt
              </Text>
            </View>
          </Card>

          <Card className="mb-8 w-full bg-white/95">
            <View className="flex-row items-center">
              <Users size={20} color="#7C5CFC" />
              <Text className="ml-3 font-poppins-medium text-sm text-textPrimary">
                {favoriteCount} Vertrauensperson(en) benachrichtigt
              </Text>
            </View>
          </Card>

          <Button label="Ich bin in Sicherheit" onPress={handleResolve} />
          <View className="h-3" />
          <Pressable onPress={handleCancel} className="flex-row items-center">
            <X size={16} color="#FFFFFF" />
            <Text className="ml-2 font-poppins-medium text-sm text-white">SOS abbrechen</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </LinearGradient>
  );
};
