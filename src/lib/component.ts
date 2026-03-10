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
