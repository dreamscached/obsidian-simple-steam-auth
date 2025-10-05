import { Plugin } from "obsidian";

import { SteamGuardCodePlugin } from "$components/SteamGuardCode/SteamGuardCodePlugin.js";
import { SteamGuardCodeMarkdownPostProcessor } from "$lib/common.js";

export default class SteamTotpPlugin extends Plugin {
	override async onload() {
		this.registerEditorExtension(SteamGuardCodePlugin.toExtension());
		this.registerMarkdownPostProcessor(SteamGuardCodeMarkdownPostProcessor);
	}
}
