import i18n from "i18next";
import { App, PluginSettingTab, Setting } from "obsidian";

import type SimpleSteamAuthPlugin from "../../main.js";

import { getSettings } from "./settings.svelte.js";
import type { SimpleSteamAuthSettings } from "./types.js";

export class SimpleSteamAuthSettingsTab extends PluginSettingTab {
	private readonly plugin: SimpleSteamAuthPlugin;
	private settings: SimpleSteamAuthSettings;

	constructor(app: App, plugin: SimpleSteamAuthPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = getSettings();
	}

	override display() {
		this.containerEl.empty();
		this.addShowCopyButton();
		this.addShowCodeByDefault();
	}

	private addShowCopyButton() {
		// TODO i18n
		new Setting(this.containerEl)
			.setName(i18n.t("settings.general.showCopyButton.name")) // Show copy button
			.setDesc(i18n.t("settings.general.showCopyButton.desc")) // Toggle display of copy button next to the Steam Guard code
			.addToggle((toggle) =>
				toggle.setValue(this.settings.showCopyButton).onChange(async (value) => {
					this.settings.showCopyButton = value;
					await this.plugin.saveSettings();
				})
			);
	}

	private addShowCodeByDefault() {
		// TODO i18n
		new Setting(this.containerEl)
			.setName(i18n.t("settings.general.showCodeByDefault.name")) // Show code by default
			.setDesc(
				createFragment((descEl) => {
					descEl.createDiv().innerHTML = i18n.t(
						"settings.general.showCodeByDefault.descHtml"
					);
					// `
					// 	Always show Steam Guard code, without having to click on it to reveal.<br>
					// 	<b>Warning!</b> This will lessen the security of your account.
					// `
				})
			)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.showCodeByDefault).onChange(async (value) => {
					this.settings.showCodeByDefault = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
