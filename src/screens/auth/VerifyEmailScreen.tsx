/**
 * E-Mail-Verifizierung Screen – Supabase statt Firebase
 */
import React, { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { MailCheck } from "lucide-react-native";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Button } from "@components/ui/Button";
import { supabase } from "@supabaseConfig/supabaseClient";
import { resendVerificationEmail } from "@supabaseConfig/authService";

export const VerifyEmailScreen: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // E-Mail des aktuellen Nutzers laden
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerificationEmail();
    } finally {
      setSending(false);
    }
  };

  const handleContinue = async () => {
    setChecking(true);
    try {
      // Session neu laden – Supabase aktualisiert confirmed_at nach Bestätigung
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getUser();
      if (data.user?.confirmed_at) {
        router.replace("/(tabs)/home");
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1 items-center justify-center px-4">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-2xl bg-accent">
          <MailCheck size={40} color="#7C5CFC" />
        </View>
        <Text className="mb-2 text-center font-poppins-bold text-2xl text-textPrimary">
          Bestätige deine E-Mail
        </Text>
        <Text className="mb-8 text-center font-poppins text-sm text-textSecondary">
          Wir haben dir einen Bestätigungslink an {email ?? "deine E-Mail-Adresse"} gesendet.
          Bitte klicke darauf, um fortzufahren.
        </Text>

        <Button label="Ich habe bestätigt" onPress={handleContinue} loading={checking} />
        <View className="h-3" />
        <Button
          label="E-Mail erneut senden"
          variant="outline"
          onPress={handleResend}
          loading={sending}
        />
      </View>
    </ScreenContainer>
  );
};
