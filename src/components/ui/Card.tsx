/**
 * Premium Card-Komponente mit Schatten & abgerundeten Ecken
 */
import React from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <View
      className={`rounded-2xl bg-white p-5 shadow-md shadow-black/5 ${className ?? ""}`}
      style={{
        shadowColor: "#1A1A2E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
      {...rest}
    >
      {children}
    </View>
  );
};
