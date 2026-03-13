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
import { mount, unmount, type Component, type MountOptions } from "svelte";

import { MarkdownRenderChild } from "obsidian";

import type SimpleSteamAuthPlugin from "../main.js";

export const PLUGIN_CONTEXT = Symbol("PLUGIN_CONTEXT");

type MountComponentConstructor<Props extends Record<string, unknown>> = Component<Props>;
type MountComponentOptions<Props extends Record<string, unknown>> = MountOptions<Props> & {
	target: HTMLElement;
};
type MountedComponent = ReturnType<typeof mount>;

/**
 * Utility class to inject Svelte components in Markdown post-processed document.
 */
export class MarkdownRenderComponent<
	Props extends Record<string, unknown>
> extends MarkdownRenderChild {
	private readonly mountConstructor: MountComponentConstructor<Props>;
	private readonly mountOptions: MountComponentOptions<Props>;
	private component?: MountedComponent;

	/**
	 * Create a new instance of {@link MarkdownRenderComponent}.
	 * @param plugin Simple Steam Auth plugin
	 * @param componentConstructor Svelte component to inject
	 * @param mountOptions props to pass to Svelte component
	 */
	constructor(
		plugin: SimpleSteamAuthPlugin,
		componentConstructor: MountComponentConstructor<Props>,
		mountOptions: MountComponentOptions<Props>
	) {
		super(mountOptions.target);
		this.mountConstructor = componentConstructor;
		this.mountOptions = mountOptions;
		this.mountOptions.context = new Map([[PLUGIN_CONTEXT, plugin]]);
	}

	override onload() {
		this.component = mount(this.mountConstructor, this.mountOptions);
	}

	override onunload() {
		return unmount(this.component!);
	}
}
