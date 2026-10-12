module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "warn", 
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: ["/dist/*", "node_modules/", ".expo/"],
};
