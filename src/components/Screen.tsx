/**
 * Screen-Wrapper: Rosé-Verlauf, SafeArea, optionaler Header mit Zurück-Pfeil.
 */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { Colors, Fonts, Gradients } from "@/theme";

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  back?: boolean;
  scroll?: boolean;
  right?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  title,
  back = false,
  scroll = true,
  right,
  contentStyle,
}) => {
  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={Gradients.background} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {(title || back) && (
          <View style={styles.header}>
            <View style={styles.side}>
              {back && (
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Zurück"
                >
                  <ChevronLeft size={26} color={Colors.text} />
                </Pressable>
              )}
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={[styles.side, styles.sideRight]}>{right}</View>
          </View>
        )}
        {body}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  side: { width: 40 },
  sideRight: { alignItems: "flex-end" },
  title: {
    flex: 1,
    textAlign: "center",
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: Colors.text,
  },
});
