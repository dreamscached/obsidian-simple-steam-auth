/**
 * SimpleSteamAuth stored settings.
 */
export interface SimpleSteamAuthSettings {
	showCopyButton: boolean;
	showCodeByDefault: boolean;
}

/**
 * Default values for {@link SimpleSteamAuthSettings}.
 */
export const defaultSettings: SimpleSteamAuthSettings = {
	showCopyButton: true,
	showCodeByDefault: false
};
