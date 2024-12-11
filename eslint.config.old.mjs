import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import immutable from "eslint-plugin-immutable";
import fp from "eslint-plugin-fp";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules/"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "plugin:react/recommended",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(_import),
        immutable,
        fp,
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {},
        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "no-var": "error",

        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],

        "no-else-return": "warn",
        "no-useless-return": "warn",
        "no-shadow": "warn",
        yoda: "warn",
        "no-undef-init": "warn",
        "prefer-arrow-callback": "warn",
        "prefer-const": "warn",
        "prefer-destructuring": "warn",
        "prefer-spread": "warn",
        "prefer-object-spread": "warn",
        "no-useless-rename": "warn",
        "object-shorthand": "warn",
        "prefer-template": "warn",
        "no-param-reassign": "warn",
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
        "@typescript-eslint/no-require-imports": "warn",

        "@typescript-eslint/ban-types": ["warn", {
            types: {
                Function: {
                    message: "Use (...args: unknown[]) => unknown instead",
                },
            },
        }],

        "@typescript-eslint/array-type": "warn",
        "import/no-default-export": "warn",
        "immutable/no-mutation": "warn",
        "fp/no-arguments": "warn",
        "fp/no-class": "warn",
        "fp/no-delete": "warn",
        "fp/no-events": "warn",
        "fp/no-get-set": "warn",
        "fp/no-loops": "warn",
        "fp/no-mutating-assign": "warn",

        "fp/no-mutating-methods": ["warn", {
            allowedObjects: ["_", "R", "fp", "history", "EditorState"],
        }],

        "fp/no-proxy": "warn",
        "fp/no-this": "warn",
        "fp/no-valueof-field": "warn",
        "no-extra-boolean-cast": "warn",
        "no-debugger": "warn",

        "no-empty": ["warn", {
            allowEmptyCatch: true,
        }],

        "no-regex-spaces": "warn",
        "no-unexpected-multiline": "warn",
        "no-unreachable": "warn",
        "use-isnan": "warn",
        "no-empty-pattern": "warn",
        "no-useless-catch": "warn",
        "no-useless-escape": "warn",
        "no-mixed-spaces-and-tabs": "warn",
        "no-constant-condition": "warn",
        "no-irregular-whitespace": "warn",
        "constructor-super": "off",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/prefer-namespace-keyword": "warn",
        "@typescript-eslint/triple-slash-reference": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/no-unresolved": "off",
        "import/default": "off",
        "import/named": "off",
        "import/namespace": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/jsx-key": "warn",
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "react/jsx-no-undef": "off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            ignoreRestSiblings: true,
        }],

        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",
    },
}];