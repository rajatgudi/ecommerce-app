// Flat config for ESLint v9+
// Migrated from legacy eslintrc and .eslintignore

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    // Ignore patterns migrated from .eslintignore
    {
        ignores: ["dist/**", "node_modules/**", "drizzle/**", ".eslintrc.cjs"],
    },

    // Base JS recommended rules
    js.configs.recommended,

    // TypeScript-specific configuration
    ...tseslint.configs.recommended, // lightweight without type-checking
    // Note: Skipping recommendedTypeChecked to avoid heavy type-aware linting that may OOM in CI/limited envs

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            // Match previous config rules
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {prefer: "type-imports"}
            ],
            // no-undef is not applicable with TypeScript
            "no-undef": "off",
        },
    },
];
