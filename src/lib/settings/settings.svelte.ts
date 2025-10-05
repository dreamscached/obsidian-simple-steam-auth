import { defaultSettings, type SteamTotpPluginSetings } from "./types.js";

let settings = $state<SteamTotpPluginSetings>(defaultSettings);

export function getSettings(): SteamTotpPluginSetings {
	return settings;
}

export function setSettings(newSettings: SteamTotpPluginSetings) {
	settings = newSettings;
}
