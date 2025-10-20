import { defineConfig } from "i18next-cli";
import i18nextSveltePlugin from "i18next-cli-plugin-svelte";

export default defineConfig({
	locales: ["en", "cs"],
	extract: {
		input: "src/**/*.{ts,svelte}",
		output: "src/assets/i18n/{{language}}.json",
		mergeNamespaces: true,
		keySeparator: false,
		sort: () => 0, // maintain order of occurrence
		removeUnusedKeys: false
	},
	plugins: [
		i18nextSveltePlugin
	]
});
