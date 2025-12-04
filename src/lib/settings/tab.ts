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
		new Setting(this.containerEl)
			.setName(i18n.t("settings.general.showCopyButton.name"))
			.setDesc(i18n.t("settings.general.showCopyButton.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.showCopyButton).onChange(async (value) => {
					this.settings.showCopyButton = value;
					await this.plugin.saveSettings();
				})
			);
	}

	private addShowCodeByDefault() {
		new Setting(this.containerEl)
			.setName(i18n.t("settings.general.showCodeByDefault.name"))
			.setDesc(
				createFragment((descEl) => {
					const div = descEl.createDiv();
					div.createSpan({
						text: i18n.t("settings.general.showCodeByDefault.desc.span.0")
					});
					div.createEl("br");
					div.createEl("b", {
						text: i18n.t("settings.general.showCodeByDefault.desc.b.0")
					});
					div.createSpan({
						text: i18n.t("settings.general.showCodeByDefault.desc.span.1")
					});
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
