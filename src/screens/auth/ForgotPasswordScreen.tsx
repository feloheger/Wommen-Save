/**
 * Passwort vergessen Screen
 */
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { resetPasswordSchema, type ResetPasswordFormData } from "@utils/validation";
import { requestPasswordReset } from "@firebase-config/authService";

export const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setFirebaseError(null);
    setLoading(true);
    try {
      await requestPasswordReset(data.email);
      setSent(true);
    } catch (err) {
      setFirebaseError("Es konnte keine E-Mail gesendet werden. Bitte überprüfe die Adresse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} className="mt-4 mb-6 h-10 w-10 items-center justify-center rounded-full bg-accent">
        <ArrowLeft size={20} color="#1A1A2E" />
      </Pressable>

      <Text className="mb-2 font-poppins-bold text-2xl text-textPrimary">Passwort vergessen</Text>
      <Text className="mb-8 font-poppins text-sm text-textSecondary">
        Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
      </Text>

      {sent ? (
        <View className="items-center rounded-2xl bg-accent p-6">
          <CheckCircle2 size={40} color="#34C77B" />
          <Text className="mt-4 text-center font-poppins-medium text-base text-textPrimary">
            E-Mail wurde gesendet!
          </Text>
          <Text className="mt-2 text-center font-poppins text-sm text-textSecondary">
            Bitte überprüfe dein Postfach und folge den Anweisungen.
          </Text>
        </View>
      ) : (
        <>
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

          {firebaseError && (
            <Text className="mb-4 text-center font-poppins text-sm text-danger">
              {firebaseError}
            </Text>
          )}

          <Button label="Link senden" onPress={handleSubmit(onSubmit)} loading={loading} />
        </>
      )}
    </ScreenContainer>
  );
};
