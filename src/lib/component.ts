import { mount, unmount, type Component, type MountOptions } from "svelte";

import { MarkdownRenderChild } from "obsidian";

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
	 * @param componentConstructor Svelte component to inject
	 * @param mountOptions props to pass to Svelte component
	 */
	constructor(
		componentConstructor: MountComponentConstructor<Props>,
		mountOptions: MountComponentOptions<Props>
	) {
		super(mountOptions.target);
		this.mountConstructor = componentConstructor;
		this.mountOptions = mountOptions;
	}

	override onload() {
		this.component = mount(this.mountConstructor, this.mountOptions);
	}

	override onunload() {
		return unmount(this.component!);
	}
}
