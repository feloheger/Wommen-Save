/**
 * Logo – Schild mit Herz (react-native-svg)
 */
import React from "react";
import Svg, { Path } from "react-native-svg";

interface LogoProps {
  size?: number;
  stroke?: string;
  fill?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 96, stroke = "#FFFFFF", fill = "#F7B7C8" }) => (
  <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
    <Path
      d="M50 4 L88 18 V52 C88 76 72 94 50 106 C28 94 12 76 12 52 V18 Z"
      fill="none"
      stroke={stroke}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <Path
      d="M50 78 C32 64 28 52 28 44 C28 36 34 31 41 31 C45 31 48 33 50 36 C52 33 55 31 59 31 C66 31 72 36 72 44 C72 52 68 64 50 78 Z"
      fill={fill}
    />
  </Svg>
);
