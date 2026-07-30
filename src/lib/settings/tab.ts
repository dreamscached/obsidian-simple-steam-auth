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
import { App, PluginSettingTab, Setting, type SettingDefinitionItem } from "obsidian";

import { ConfirmModal } from "$lib/modal.js";

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

	override getSettingDefinitions(): SettingDefinitionItem<keyof SimpleSteamAuthSettings>[] {
		return [
			{
				name: i18n.t("settings.general.showCopyButton.name"),
				desc: i18n.t("settings.general.showCopyButton.desc"),
				control: { type: "toggle", key: "showCopyButton" }
			},
			{
				name: i18n.t("settings.general.showCodeByDefault.name"),
				desc: i18n.t("settings.general.showCodeByDefault.desc"),
				// Rendered imperatively because a bound control switches on before
				// the confirmation modal is answered.
				render: (setting) => this.addShowCodeByDefaultToggle(setting)
			}
		];
	}

	override getControlValue(key: keyof SimpleSteamAuthSettings): unknown {
		return this.settings[key];
	}

	override async setControlValue(
		key: keyof SimpleSteamAuthSettings,
		value: unknown
	): Promise<void> {
		switch (key) {
			case "showCopyButton":
				this.settings[key] = value as boolean;
				break;
			// showCodeByDefault is not bound to a control, see getSettingDefinitions.
			case "showCodeByDefault":
				return;
		}
		await this.plugin.saveSettings();
	}

	/**
	 * @deprecated Fallback for Obsidian versions older than 1.13.0.
	 */
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
		const setting = new Setting(this.containerEl)
			.setName(i18n.t("settings.general.showCodeByDefault.name"))
			.setDesc(i18n.t("settings.general.showCodeByDefault.desc"));
		this.addShowCodeByDefaultToggle(setting);
	}

	private addShowCodeByDefaultToggle(setting: Setting) {
		setting.addToggle((toggle) =>
			toggle.setValue(this.settings.showCodeByDefault).onChange(async (value) => {
				// setValue() below re-enters this handler, ignore its own changes.
				if (value === this.settings.showCodeByDefault) return;

				// Clicking the toggle already switched it on, put it back until the warning is accepted.
				if (value) {
					toggle.setValue(false);
					if (!(await this.confirmShowCodeByDefault())) return;
				}

				this.settings.showCodeByDefault = value;
				toggle.setValue(value);
				await this.plugin.saveSettings();
			})
		);
	}

	private confirmShowCodeByDefault(): Promise<boolean> {
		return new ConfirmModal(this.app, {
			title: i18n.t("settings.general.showCodeByDefault.confirm.title"),
			message: i18n.t("settings.general.showCodeByDefault.confirm.message"),
			confirmText: i18n.t("settings.general.showCodeByDefault.confirm.confirm"),
			cancelText: i18n.t("settings.general.showCodeByDefault.confirm.cancel")
		}).confirm();
	}
}
