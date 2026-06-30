/**
 * Fake Call Screen – Anrufer wählen, Timer einstellen, realistischer Anruf
 */
import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Phone, PhoneOff, Mic, Video } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Button } from "@components/ui/Button";
import { useFakeCall } from "@hooks/useFakeCall";
import { FAKE_CALL_TIMERS } from "@constants/config";
import type { FakeCallProfile } from "@types/index";

const PRESET_CALLERS: FakeCallProfile[] = [
  { id: "mama", name: "Mama", isCustom: false },
  { id: "freundin", name: "Freundin", isCustom: false },
];

export const FakeCallScreen: React.FC = () => {
  const { isRinging, caller, scheduleCall, cancelScheduledCall, endCall } = useFakeCall();
  const [customName, setCustomName] = useState("");
  const [selectedTimer, setSelectedTimer] = useState(FAKE_CALL_TIMERS[1]);

  if (isRinging && caller) {
    return (
      <View className="flex-1 bg-textPrimary items-center justify-between py-20">
        <View className="items-center">
          <View className="mb-6 h-28 w-28 items-center justify-center rounded-full bg-white/10">
            <Text className="font-poppins-bold text-4xl text-white">
              {caller.name.charAt(0)}
            </Text>
          </View>
          <Text className="font-poppins-semibold text-2xl text-white">{caller.name}</Text>
          <Text className="mt-2 font-poppins text-sm text-white/70">eingehender Anruf…</Text>
        </View>

        <View className="w-full flex-row items-center justify-around px-10">
          <Pressable
            onPress={endCall}
            className="h-16 w-16 items-center justify-center rounded-full bg-danger"
          >
            <PhoneOff size={28} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={endCall}
            className="h-16 w-16 items-center justify-center rounded-full bg-success"
          >
            <Phone size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View className="mt-6 mb-8 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          <Phone size={32} color="#7C5CFC" />
        </View>
        <Text className="font-poppins-bold text-2xl text-textPrimary">Fake Call</Text>
        <Text className="mt-2 text-center font-poppins text-sm text-textSecondary">
          Simuliere einen eingehenden Anruf, um dich unauffällig aus einer unangenehmen Situation
          zu befreien.
        </Text>
      </View>

      <Text className="mb-3 font-poppins-medium text-sm text-textPrimary">Anrufer auswählen</Text>
      <View className="mb-6 flex-row flex-wrap gap-3">
        {PRESET_CALLERS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => scheduleCall(c, selectedTimer.seconds)}
            className="rounded-xl bg-accent px-4 py-3"
          >
            <Text className="font-poppins-medium text-sm text-textPrimary">{c.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-3 font-poppins-medium text-sm text-textPrimary">
        Eigener Name (optional)
      </Text>
      <TextInput
        value={customName}
        onChangeText={setCustomName}
        placeholder="z. B. Chef, Schwester…"
        placeholderTextColor="#A0A0B8"
        className="mb-6 rounded-2xl bg-accent px-4 py-4 font-poppins text-base text-textPrimary"
      />

      <Text className="mb-3 font-poppins-medium text-sm text-textPrimary">Anruf in</Text>
      <View className="mb-8 flex-row flex-wrap gap-3">
        {FAKE_CALL_TIMERS.map((timer) => (
          <Pressable
            key={timer.seconds}
            onPress={() => setSelectedTimer(timer)}
            className={`rounded-xl px-4 py-3 ${
              selectedTimer.seconds === timer.seconds ? "bg-primary" : "bg-accent"
            }`}
          >
            <Text
              className={`font-poppins-medium text-sm ${
                selectedTimer.seconds === timer.seconds ? "text-white" : "text-textPrimary"
              }`}
            >
              {timer.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button
        label="Fake Call planen"
        onPress={() =>
          scheduleCall(
            customName
              ? { id: "custom", name: customName, isCustom: true }
              : PRESET_CALLERS[0],
            selectedTimer.seconds,
          )
        }
      />
      <View className="h-3" />
      <Button label="Abbrechen" variant="outline" onPress={cancelScheduledCall} />

      <View className="mt-6 flex-row items-center justify-center opacity-50">
        <Mic size={14} color="#6B6B85" />
        <Text className="mx-2 font-poppins text-xs text-textSecondary">·</Text>
        <Video size={14} color="#6B6B85" />
      </View>
    </ScreenContainer>
  );
};
