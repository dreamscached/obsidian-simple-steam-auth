import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type PluginValue,
	type ViewUpdate
} from "@codemirror/view";

import { getSteamGuardCodeAnchorsAst, getSteamGuardCodeSharedSecret } from "$lib/common.js";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

export class SteamGuardCodePlugin implements PluginValue {
	private decorations: DecorationSet;
	private decorationRanges: [number, number][] = [];

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
			const inAny = this.decorationRanges.some(([from, to]) => pos >= from && pos <= to);
			this.decorations = inAny ? Decoration.none : this.rebuildDecorations(update.view);
			return;
		}
	}

	destroy(): void {}

	private rebuildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		this.decorationRanges = [];

		getSteamGuardCodeAnchorsAst(view).forEach((it) => {
			const text = view.state.doc.sliceString(it.from, it.to);
			const sharedSecret = getSteamGuardCodeSharedSecret(text);
			this.decorationRanges.push([it.from - 1, it.to + 1]);
			builder.add(
				it.from - 1,
				it.to + 1,
				Decoration.replace({
					widget: new SteamGuardCodeWidget({ sharedSecret }),
					inclusive: false
				})
			);
		});

		return builder.finish();
	}
}
