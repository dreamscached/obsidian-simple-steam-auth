import { Plugin } from "obsidian";

import { SteamGuardCodePlugin } from "$components/SteamGuardCode/SteamGuardCodePlugin.js";
import { SteamGuardCodeMarkdownPostProcessor } from "$lib/common.js";
import { getSettings, setSettings } from "$lib/settings/settings.svelte.js";
import { SimpleSteamAuthSettingsTab } from "$lib/settings/tab.js";
import { defaultSettings } from "$lib/settings/types.js";

/**
 * # Simple Steam Auth
 *
 * Dynamic, real-time updated Steam Guard code component right in your Obsidian notes!
 *
 * @author dreamscached
 */
export default class SimpleSteamAuthPlugin extends Plugin {
	override async onload() {
		await this.loadSettings();
		this.registerSettings();
		this.registerSteamGuardCodeComponent();
	}

	async loadSettings() {
		const newSettings = Object.assign({}, defaultSettings, await this.loadData());
		setSettings(newSettings);
	}

	async saveSettings() {
		const currentSettings = getSettings();
		await this.saveData(currentSettings);
	}

	private registerSettings() {
		this.addSettingTab(new SimpleSteamAuthSettingsTab(this.app, this));
	}

	private registerSteamGuardCodeComponent() {
		this.registerEditorExtension(SteamGuardCodePlugin.createViewPlugin(this.app));
		this.registerMarkdownPostProcessor(SteamGuardCodeMarkdownPostProcessor);
	}
}
