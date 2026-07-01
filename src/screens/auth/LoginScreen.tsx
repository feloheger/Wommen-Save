/**
 * Login Screen – Supabase statt Firebase
 */
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Shield } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { loginSchema, type LoginFormData } from "@utils/validation";
import { loginUser } from "@supabase/authService";

export const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setLoading(true);
    try {
      await loginUser(data.email, data.password);
      router.replace("/(tabs)/home");
    } catch {
      setAuthError("Anmeldung fehlgeschlagen. Bitte überprüfe deine Daten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="mt-10 mb-10 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          <Shield size={32} color="#7C5CFC" />
        </View>
        <Text className="font-poppins-bold text-2xl text-textPrimary">Willkommen zurück</Text>
        <Text className="mt-2 font-poppins text-sm text-textSecondary">
          Melde dich an, um sicher zu bleiben.
        </Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="E-Mail"
            placeholder="deine@email.de"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color="#6B6B85" />}
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Passwort"
            placeholder="••••••••"
            secureTextEntry
            icon={<Lock size={18} color="#6B6B85" />}
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      <Pressable onPress={() => router.push("/(auth)/forgot-password")} className="mb-6 self-end">
        <Text className="font-poppins-medium text-sm text-primary">Passwort vergessen?</Text>
      </Pressable>

      {authError && (
        <Text className="mb-4 text-center font-poppins text-sm text-danger">{authError}</Text>
      )}

      <Button label="Anmelden" onPress={handleSubmit(onSubmit)} loading={loading} />

      <View className="mt-8 flex-row justify-center">
        <Text className="font-poppins text-sm text-textSecondary">Noch kein Konto? </Text>
        <Pressable onPress={() => router.push("/(auth)/register")}>
          <Text className="font-poppins-semibold text-sm text-primary">Registrieren</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};
