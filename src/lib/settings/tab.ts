import { App, PluginSettingTab, Setting } from "obsidian";

import type SteamTotpPlugin from "../../main.js";

import { getSettings } from "./settings.svelte.js";
import type { SteamTotpPluginSetings } from "./types.js";

export class SteamTotpPluginSetingsTab extends PluginSettingTab {
	private readonly plugin: SteamTotpPlugin;
	private settings: SteamTotpPluginSetings;

	constructor(app: App, plugin: SteamTotpPlugin) {
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
			.setName("Show copy button")
			.setDesc("Toggle display of copy button next to the Steam Guard code")
			.addToggle((toggle) =>
				toggle.setValue(this.settings.showCopyButton).onChange(async (value) => {
					this.settings.showCopyButton = value;
					await this.plugin.saveSettings();
				})
			);
	}

	private addShowCodeByDefault() {
		new Setting(this.containerEl)
			.setName("Show code by default")
			.setDesc(
				createFragment((descEl) => {
					descEl.createDiv().innerHTML = `
                    Always show Steam Guard code, without having to click on it to reveal.<br>
                    <b>Warning!</b> This will lessen the security of your account.
                `;
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
