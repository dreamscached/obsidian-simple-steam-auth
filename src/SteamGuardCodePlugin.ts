import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type PluginValue,
	type ViewUpdate
} from "@codemirror/view";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

export class SteamGuardCodePlugin implements PluginValue {
	private decorations: DecorationSet;
	private ranges: [number, number][] = [];

	constructor(view: EditorView) {
		this.decorations = this.rebuildDecorations(view);
	}

	static toExtension(): Extension {
		return ViewPlugin.fromClass(SteamGuardCodePlugin, {
			decorations: (it) => it.decorations
		});
	}

	update(update: ViewUpdate): void {
		if (update.docChanged || update.selectionSet || update.viewportChanged) {
			const pos = update.state.selection.main.head;
			const inAny = this.ranges.some(([from, to]) => pos >= from && pos <= to);
			this.decorations = inAny ? Decoration.none : this.rebuildDecorations(update.view);
			return;
		}

		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.rebuildDecorations(update.view);
		}
	}

	destroy(): void {}

	private rebuildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		this.ranges = []; // reset each rebuild

		for (const vr of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from: vr.from,
				to: vr.to,
				enter: (node) => {
					if (node.type.name === "inline-code") {
						const text = view.state.doc.sliceString(node.from, node.to);
						const match = /^::steam-guard-code::(.+)$/.exec(text);
						if (match) {
							// keep track of the range for cursor‑in‑block detection
							this.ranges.push([node.from - 1, node.to + 1]);

							builder.add(
								node.from - 1,
								node.to + 1,
								Decoration.replace({
									widget: new SteamGuardCodeWidget({ sharedSecret: match[1] }),
									inclusive: false
								})
							);
						}
					}
				}
			});
		}
		return builder.finish();
	}
}
