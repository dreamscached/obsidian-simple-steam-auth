import { mount, unmount, type Component, type MountOptions } from "svelte";

import { MarkdownRenderChild } from "obsidian";

type MountComponentConstructor<Props extends Record<string, unknown>> = Component<Props>;
type MountComponentOptions<Props extends Record<string, unknown>> = MountOptions<Props> & {
	target: HTMLElement;
};
type MountedComponent = ReturnType<typeof mount>;

export class MarkdownRenderComponent<
	Props extends Record<string, unknown>
> extends MarkdownRenderChild {
	private readonly _mountConstructor: MountComponentConstructor<Props>;
	private readonly _mountOptions: MountComponentOptions<Props>;
	private _component?: MountedComponent;

	constructor(
		componentConstructor: MountComponentConstructor<Props>,
		mountOptions: MountComponentOptions<Props>
	) {
		super(mountOptions.target);
		this._mountConstructor = componentConstructor;
		this._mountOptions = mountOptions;
	}

	override onload() {
		this._component = mount(this._mountConstructor, this._mountOptions);
	}

	override unload() {
		return unmount(this._component!);
	}
}
