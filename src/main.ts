import { Plugin } from "obsidian";

import { SteamGuardCodePlugin } from "$components/SteamGuardCode/SteamGuardCodePlugin.js";
import { SteamGuardCodeMarkdownPostProcessor } from "$lib/common.js";
import { getSettings, setSettings } from "$lib/settings/settings.svelte.js";
import { SimpleSteamAuthSettingsTab } from "$lib/settings/tab.js";
import { defaultSettings } from "$lib/settings/types.js";

export default class SimpleSteamAuthPlugin extends Plugin {
	override async onload() {
		await this.loadSettings();
		this.addSettingTab(new SimpleSteamAuthSettingsTab(this.app, this));
		this.registerEditorExtension(SteamGuardCodePlugin.createViewPlugin(this.app));
		this.registerMarkdownPostProcessor(SteamGuardCodeMarkdownPostProcessor);
	}

	async loadSettings() {
		const newSettings = Object.assign({}, defaultSettings, await this.loadData());
		setSettings(newSettings);
	}

	async saveSettings() {
		const currentSettings = getSettings();
		await this.saveData(currentSettings);
	}
}
