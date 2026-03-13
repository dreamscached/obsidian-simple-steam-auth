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
import { defaultSettings, type SimpleSteamAuthSettings } from "./types.js";

let settings = $state<SimpleSteamAuthSettings>(defaultSettings);

/**
 * Returns global state of SimpleSteamAuth settings.
 * @returns plugin settings global state
 */
export function getSettings(): SimpleSteamAuthSettings {
	return settings;
}

/**
 * Overwrites global state of SimpleSteamAuth settings.
 * @param newSettings new settings
 */
export function setSettings(newSettings: SimpleSteamAuthSettings) {
	settings = newSettings;
}
