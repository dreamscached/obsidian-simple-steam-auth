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
import { getLanguage } from "obsidian";

export async function initI18n() {
	await i18n.init({
		lng: getLanguage(),
		fallbackLng: "en",
		// prettier-ignore
		resources: {
			"en": (await import("$assets/i18n/en.json", { with: { type: "json" } })).default,
			"en-GB": (await import("$assets/i18n/en-GB.json", { with: { type: "json" } })).default,
			"cs": (await import("$assets/i18n/cs.json", { with: { type: "json" } })).default,
			"ru": (await import("$assets/i18n/ru.json", { with: { type: "json" } })).default,
			"de": (await import("$assets/i18n/de.json", { with: { type: "json" } })).default,
			"fr": (await import("$assets/i18n/fr.json", { with: { type: "json" } })).default
		}
	});
}
