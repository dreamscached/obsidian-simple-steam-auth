/*
 * Simple Steam Auth - Generate Steam Guard codes right in your vault.
 * Copyright (C) 2026 dreamscached <dreamscache.d@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
