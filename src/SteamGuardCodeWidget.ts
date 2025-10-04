import { WidgetType } from "@codemirror/view";
import { mount, unmount, type ComponentProps } from "svelte";

import SteamGuardCode from "./SteamGuardCode.svelte";

export class SteamGuardCodeWidget extends WidgetType {
	private readonly props: ComponentProps<typeof SteamGuardCode>;
	private instance?: ReturnType<typeof mount>;

	constructor(props: ComponentProps<typeof SteamGuardCode>) {
		super();
		this.props = props;
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
		return false;
	}
}
