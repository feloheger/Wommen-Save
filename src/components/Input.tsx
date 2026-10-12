import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Colors, Fonts, Radius } from "@/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, onFocus, onBlur, ...rest }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.placeholder}
        style={[styles.input, focused && styles.focused, !!error && styles.error]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text, marginBottom: 6 },
  input: {
    height: 50,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  focused: { borderColor: Colors.primary },
  error: { borderColor: Colors.danger },
  errorText: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.danger, marginTop: 4 },
});
