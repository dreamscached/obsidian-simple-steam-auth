import { mount, unmount, type ComponentProps } from "svelte";

import { WidgetType } from "@codemirror/view";
import deepEqual from "deep-equal";

import SteamGuardCode from "./SteamGuardCode.svelte";

/**
 * CodeMirror {@link WidgetType} implementation to mount {@link SteamGuardCode}
 * Svelte component onto the Markdown editor.
 */
export class SteamGuardCodeWidget extends WidgetType {
	private readonly props: ComponentProps<typeof SteamGuardCode>;
	private instance?: ReturnType<typeof mount>;

	/**
	 * Create a new instance of {@link SteamGuardCodeWidget} class.
	 * @param props props to pass to {@link SteamGuardCode} component
	 */
	constructor(props: ComponentProps<typeof SteamGuardCode>) {
		super();
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
			props: this.props
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
