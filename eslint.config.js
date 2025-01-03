import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        rules: {
            "prefer-const": "error",
            "linebreak-style": ["error", "unix"],
            "prefer-arrow-callback": "error",
            "comma-dangle": [
                "error",
                {
                    "arrays": "only-multiline",
                    "objects": "always-multiline",
                    "imports": "always-multiline",
                    "exports": "always-multiline",
                    "functions": "never",
                },
            ],
        },
    }
);
