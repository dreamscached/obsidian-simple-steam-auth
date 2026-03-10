import { Events, Plugin } from "obsidian";

import { SteamGuardCodePlugin } from "$components/SteamGuardCode/SteamGuardCodePlugin.js";
import { createMarkdownPostProcessor } from "$lib/common.js";
import { initI18n } from "$lib/i18n.js";
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
	/** Event emitter. */
	public events = new Events();

	override async onload() {
		await initI18n();
		await this.loadSettings();
		this.registerSettings();
		this.registerSteamGuardCodeComponent();
		this.registerRefreshTimer();
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
		this.registerEditorExtension(SteamGuardCodePlugin.createViewPlugin());
		this.registerMarkdownPostProcessor(createMarkdownPostProcessor(this));
	}

	private registerRefreshTimer() {
		this.registerInterval(window.setInterval(() => this.events.trigger("refresh"), 30e3));
	}
}
