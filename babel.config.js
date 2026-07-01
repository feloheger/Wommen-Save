module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@hooks": "./src/hooks",
            "@services": "./src/services",
            "@supabase": "./src/supabase",
            "@firebase-config": "./src/firebase",
            "@constants": "./src/constants",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@store": "./src/store",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
