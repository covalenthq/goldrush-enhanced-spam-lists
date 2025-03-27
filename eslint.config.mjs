import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        ignores: ["**/*.config.js"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                console: true,
                process: true,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            semi: "error",
            "no-multiple-empty-lines": "error",
            indent: "off",
            "no-unsafe-optional-chaining": "warn",
            "prettier/prettier": "error",
            "no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: true,
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
    prettier,
];
