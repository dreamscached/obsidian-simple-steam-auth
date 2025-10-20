import { defineConfig } from "i18next-cli";

export default defineConfig({
	locales: ["en", "cs"],
	extract: {
		input: "src/**/*.ts",
		output: "src/assets/i18n/{{language}}.json",
		mergeNamespaces: true,
		keySeparator: false,
		sort: () => 0, // maintain order of occurrence
		removeUnusedKeys: false
	}
});
