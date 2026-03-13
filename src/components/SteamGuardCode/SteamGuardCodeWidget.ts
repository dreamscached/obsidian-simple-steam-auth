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
import { mount, unmount, type ComponentProps } from "svelte";

import { WidgetType } from "@codemirror/view";
import deepEqual from "deep-equal";

import { PLUGIN_CONTEXT } from "$lib/component.js";

import type SimpleSteamAuthPlugin from "../../main.js";

import SteamGuardCode from "./SteamGuardCode.svelte";

/**
 * CodeMirror {@link WidgetType} implementation to mount {@link SteamGuardCode}
 * Svelte component onto the Markdown editor.
 */
export class SteamGuardCodeWidget extends WidgetType {
	private readonly plugin: SimpleSteamAuthPlugin;
	private readonly props: ComponentProps<typeof SteamGuardCode>;
	private instance?: ReturnType<typeof mount>;

	/**
	 * Create a new instance of {@link SteamGuardCodeWidget} class.
	 * @param plugin Simple Steam Auth plugin
	 * @param props props to pass to {@link SteamGuardCode} component
	 */
	constructor(plugin: SimpleSteamAuthPlugin, props: ComponentProps<typeof SteamGuardCode>) {
		super();
		this.plugin = plugin;
		this.props = props;
	}

	override eq(widget: SteamGuardCodeWidget): boolean {
		// Prevent re-drawing instances with same props
		return deepEqual(widget.props, this.props);
	}

	override toDOM(): HTMLElement {
		const span = document.createElement("span");

		this.instance = mount(SteamGuardCode, {
			target: span,
			props: this.props,
			context: new Map([[PLUGIN_CONTEXT, this.plugin]])
		});

		return span;
	}

	override async destroy(node: HTMLElement): Promise<void> {
		if (this.instance) {
			await unmount(this.instance);
			node.remove();
		}
	}

	override ignoreEvent(): boolean {
		return true;
	}
}
