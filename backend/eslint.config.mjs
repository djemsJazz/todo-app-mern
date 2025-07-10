import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.node
    }
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 1,
      '@typescript-eslint/no-explicit-any': 2,
      '@typescript-eslint/ban-ts-comment': 'off',
      'semi': ['error', 'always'],
    },
  },
]);