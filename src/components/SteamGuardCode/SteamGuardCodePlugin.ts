import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type PluginValue,
	type ViewUpdate
} from "@codemirror/view";
import { MarkdownView, type App } from "obsidian";

import { getSteamGuardCodeAnchorsAst, getSteamGuardCodeSharedSecret } from "$lib/common.js";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

/**
 * CodeMirror ViewPlugin (created using {@link createViewPlugin}) to mount
 * {@link SteamGuardCodeWidget} onto the Markdown editor.
 */
export class SteamGuardCodePlugin implements PluginValue {
	private readonly app: App;
	private decorations: DecorationSet;
	private decorationRanges: [number, number][] = [];

	private constructor(app: App, view: EditorView) {
		this.app = app;
		this.decorations = this.rebuildDecorations(view);
	}

	/**
	 * Creates a ViewPlugin instance wrapping this class.
	 * @param app Obsidian {@link App} instance
	 * @returns CodeMirror {@link ViewPlugin} instance wrapping this class
	 */
	static createViewPlugin(app: App): Extension {
		return ViewPlugin.fromClass(
			class extends SteamGuardCodePlugin {
				constructor(view: EditorView) {
					super(app, view);
				}
			},
			{
				decorations: (it) => it.decorations
			}
		);
	}

	update(update: ViewUpdate): void {
		if (this.isSourceMode()) {
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

	/**
	 * Checks whether the current active editor is in source mode.
	 * @returns `true` if editor is in source mode, `false` if in live preview mode
	 */
	private isSourceMode(): boolean {
		// HACK: this isn't exactly a good way to detect source mode
		// https://github.com/dreamscached/obsidian-simple-steam-auth/issues/8
		const contentEl = this.app.workspace.getActiveViewOfType(MarkdownView)?.contentEl;
		const sourceView = contentEl?.querySelector("div.markdown-source-view");
		if (!sourceView) return false;
		return !sourceView.hasClass("is-live-preview");
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
