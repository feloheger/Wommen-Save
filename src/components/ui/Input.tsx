/**
 * Premium Text-Input mit Label & Fehlermeldung
 */
import React, { useState } from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, ...rest }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4 w-full">
      <Text className="mb-2 font-poppins-medium text-sm text-textPrimary">{label}</Text>
      <View
        className={`flex-row items-center rounded-2xl border bg-accent px-4 ${
          focused ? "border-primary" : error ? "border-danger" : "border-transparent"
        }`}
      >
        {icon}
        <TextInput
          className="flex-1 py-4 font-poppins text-base text-textPrimary"
          placeholderTextColor="#A0A0B8"
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error && <Text className="mt-1 font-poppins text-xs text-danger">{error}</Text>}
    </View>
  );
};
