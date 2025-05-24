import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    pluginJs.configs.recommended,
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintPluginPrettierRecommended,
    { linterOptions: { reportUnusedInlineConfigs: "error" } },
    globalIgnores(["./tests/data/testData.ts", "./src/client/src/routes"]),
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    {
        rules: {
            // suppress errors for missing 'import React' in files
            "react/react-in-jsx-scope": "off",
            // allow jsx syntax in js files (for next.js project)
            "react/jsx-filename-extension": [
                1,
                { extensions: [".js", ".jsx", ".ts", ".tsx"] },
            ],
            // should add ".ts" if typescript project
        },
    },
    { languageOptions: { globals: globals.browser } },
]);
