import i18n from "i18next";
import { getLanguage } from "obsidian";

export async function initI18n() {
	await i18n.init({
		lng: getLanguage(),
		fallbackLng: "en",
		// prettier-ignore
		resources: {
			/* eslint-disable @typescript-eslint/no-explicit-any */
			"en": ((await import("$assets/i18n/en.json", { with: { type: "json" } })) as any).default,
			"en-GB": ((await import("$assets/i18n/en-GB.json", { with: { type: "json" } })) as any).default,
			"cs": ((await import("$assets/i18n/cs.json", { with: { type: "json" } })) as any).default
			/* eslint-enable @typescript-eslint/no-explicit-any */
		}
	});
}
