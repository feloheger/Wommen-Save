/**
 * Registrierung Screen – Supabase statt Firebase
 */
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { registerSchema, type RegisterFormData } from "@utils/validation";
import { registerUser } from "@supabaseConfig/authService";

export const RegisterScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      router.replace("/(auth)/verify-email");
    } catch {
      setAuthError("Registrierung fehlgeschlagen. Diese E-Mail wird eventuell bereits verwendet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="mt-10 mb-8">
        <Text className="font-poppins-bold text-2xl text-textPrimary">Konto erstellen</Text>
        <Text className="mt-2 font-poppins text-sm text-textSecondary">
          Werde Teil von Women Save und schütze dich im Alltag.
        </Text>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Name"
            placeholder="Dein Name"
            icon={<User size={18} color="#6B6B85" />}
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Passwort bestätigen"
            placeholder="••••••••"
            secureTextEntry
            icon={<Lock size={18} color="#6B6B85" />}
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      {authError && (
        <Text className="mb-4 text-center font-poppins text-sm text-danger">{authError}</Text>
      )}

      <Button label="Registrieren" onPress={handleSubmit(onSubmit)} loading={loading} />

      <View className="mt-8 flex-row justify-center">
        <Text className="font-poppins text-sm text-textSecondary">Bereits ein Konto? </Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text className="font-poppins-semibold text-sm text-primary">Anmelden</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};
