import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type PluginValue,
	type ViewUpdate
} from "@codemirror/view";
import { editorLivePreviewField } from "obsidian";

import { getSteamGuardCodeAnchorsAst, getSteamGuardCodeSharedSecret } from "$lib/common.js";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

/**
 * CodeMirror ViewPlugin (created using {@link createViewPlugin}) to mount
 * {@link SteamGuardCodeWidget} onto the Markdown editor.
 */
export class SteamGuardCodePlugin implements PluginValue {
	private decorations: DecorationSet;
	private decorationRanges: [number, number][] = [];

	private constructor(view: EditorView) {
		this.decorations = this.rebuildDecorations(view);
	}

	/**
	 * Creates a ViewPlugin instance wrapping this class.
	 * @returns CodeMirror {@link ViewPlugin} instance wrapping this class
	 */
	static createViewPlugin(): Extension {
		return ViewPlugin.fromClass(
			class extends SteamGuardCodePlugin {
				constructor(view: EditorView) {
					super(view);
				}
			},
			{
				decorations: (it) => it.decorations
			}
		);
	}

	update(update: ViewUpdate): void {
		// @ts-expect-error this is properly typed
		if (!update.state.field(editorLivePreviewField)) {
			this.decorations = Decoration.none;
			this.decorationRanges = [];
			return;
		}

		if (update.docChanged || update.selectionSet || update.viewportChanged) {
			const pos = update.state.selection.main.head;
			const inAny = this.decorationRanges.some(([from, to]) => pos >= from && pos <= to);
			this.decorations = inAny ? Decoration.none : this.rebuildDecorations(update.view);
		}
	}

	destroy(): void {
		this.decorations = Decoration.none;
		this.decorationRanges = [];
	}

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
