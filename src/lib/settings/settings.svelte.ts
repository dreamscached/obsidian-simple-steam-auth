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
