import { Plugin } from "obsidian";

import SteamGuardCode from "./SteamGuardCode.svelte";
import { SteamGuardCodePlugin } from "./SteamGuardCodePlugin.js";
import { getSteamGuardCodeAnchorsDom, getSteamGuardCodeSharedSecret } from "./common.js";
import { MarkdownRenderComponent } from "./component.js";

export default class SteamTotpPlugin extends Plugin {
	override async onload() {
		this.registerEditorExtension(SteamGuardCodePlugin.toExtension());
		this.registerMarkdownPostProcessor((el, ctx) => {
			getSteamGuardCodeAnchorsDom(el).forEach((it) => {
				const sharedSecret = getSteamGuardCodeSharedSecret(it.textContent);
				const anchor = document.createElement("span");
				it.replaceWith(anchor);
				ctx.addChild(
					new MarkdownRenderComponent(SteamGuardCode, {
						target: anchor,
						props: {
							sharedSecret
						}
					})
				);
			});
		});
	}
}
