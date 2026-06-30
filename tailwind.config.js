/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7C5CFC",
        secondary: "#B79CFF",
        background: "#FFFFFF",
        accent: "#F3EEFF",
        danger: "#FF4D6A",
        success: "#34C77B",
        textPrimary: "#1A1A2E",
        textSecondary: "#6B6B85",
      },
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
      },
      borderRadius: {
        xl2: "24px",
      },
    },
  },
  plugins: [],
};
