/**
 * Wiederverwendbarer Screen-Wrapper mit SafeArea & Padding
 */
import React from "react";
import { View, ScrollView, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scroll = true,
  className,
  ...rest
}) => {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Wrapper
        className={`flex-1 px-5 ${className ?? ""}`}
        {...(scroll ? { showsVerticalScrollIndicator: false, contentContainerStyle: { paddingBottom: 32 } } : {})}
        {...rest}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
};
