module.exports = [
  {
    ignores: ["node_modules", ".next", "dist"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/prop-types": "off",
    },
  },
];
