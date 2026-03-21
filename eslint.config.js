// @ts-check
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
	globalIgnores([".yarn", "dist", "node_modules"]),
	{
		files: ["./src/**/*.ts"],
		languageOptions: {
			sourceType: "module",
			ecmaVersion: "latest",
			globals: globals.browser
		}
	},
	eslint.configs.recommended,
	tseslint.configs.recommended
);
