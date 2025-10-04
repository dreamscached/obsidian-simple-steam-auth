import { parseYaml, Plugin } from "obsidian";

import SteamGuardCode from "./SteamGuardCode.svelte";
import { SteamGuardCodePlugin } from "./SteamGuardCodePlugin.js";
import { MarkdownRenderComponent } from "./component.js";

export default class SteamTotpPlugin extends Plugin {
	override async onload() {
		this.registerMarkdownCodeBlockProcessor("steam-guard-code", (source, el, ctx) => {
			const config = parseYaml(source);
			ctx.addChild(
				new MarkdownRenderComponent(SteamGuardCode, {
					target: el,
					props: { sharedSecret: config.sharedSecret }
				})
			);
		});

		this.registerEditorExtension(SteamGuardCodePlugin.toExtension());
	}
}
