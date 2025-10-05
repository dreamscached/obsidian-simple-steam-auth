import { Plugin } from "obsidian";

import { SteamGuardCodePlugin } from "./SteamGuardCodePlugin.js";
import { SteamGuardCodeMarkdownPostProcessor } from "./common.js";

export default class SteamTotpPlugin extends Plugin {
	override async onload() {
		this.registerEditorExtension(SteamGuardCodePlugin.toExtension());
		this.registerMarkdownPostProcessor(SteamGuardCodeMarkdownPostProcessor);
	}
}
