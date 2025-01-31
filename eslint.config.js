import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ["src/*.ts"],
    languageOptions: {
        ecmaVersion: 2022,
        globals: globals.browser,
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
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
});
