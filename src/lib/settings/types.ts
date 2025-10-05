export interface SteamTotpPluginSetings {
	showCopyButton: boolean;
	showCodeByDefault: boolean;
}

export const defaultSettings: SteamTotpPluginSetings = {
	showCopyButton: true,
	showCodeByDefault: false
};
