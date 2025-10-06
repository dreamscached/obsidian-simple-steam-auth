import { defaultSettings, type SimpleSteamAuthSettings } from "./types.js";

let settings = $state<SimpleSteamAuthSettings>(defaultSettings);

export function getSettings(): SimpleSteamAuthSettings {
	return settings;
}

export function setSettings(newSettings: SimpleSteamAuthSettings) {
	settings = newSettings;
}
