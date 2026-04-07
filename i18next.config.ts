import { defineConfig } from "i18next-cli";
import I18nextSveltePlugin from "i18next-cli-plugin-svelte";

export default defineConfig({
	locales: ["en", "cs", "en-GB", "ru", "de", "fr"],
	extract: {
		input: "src/**/*.{ts,svelte}",
		output: "src/assets/i18n/{{language}}.json",
		mergeNamespaces: true,
		keySeparator: false,
		sort: () => 0, // maintain order of occurrence
		removeUnusedKeys: false,
		functions: ["i18n.t"] // e.g. ignore obsidianI18n
	},
	plugins: [new I18nextSveltePlugin()]
});
