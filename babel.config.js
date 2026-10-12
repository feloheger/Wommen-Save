module.exports = function (api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
=======
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
            "@supabaseConfig": "./src/supabase",
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
>>>>>>> a4f96678eab6b731130c94eee79ed2eb4b7db73b
  };
};