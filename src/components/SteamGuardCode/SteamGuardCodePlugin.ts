import { EditorSelection, type Extension, Range, StateField } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type PluginValue,
	type ViewUpdate
} from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { editorInfoField, editorLivePreviewField } from "obsidian";

import { getSteamGuardCodeAnchorsAst, getSteamGuardCodeSharedSecret } from "$lib/common.js";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

/**
 * CodeMirror ViewPlugin (created using {@link createViewPlugin}) to mount
 * {@link SteamGuardCodeWidget} onto the Markdown editor.
 */
export class SteamGuardCodePlugin implements PluginValue {
	private decorations: DecorationSet;

	private constructor(view: EditorView) {
		this.decorations = this.renderDecorations(view);
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
		if (!update.state.field(editorLivePreviewField as unknown as StateField<boolean>)) {
			this.decorations = Decoration.none;
			return;
		}

		if (update.docChanged) {
			this.decorations = this.decorations.map(update.changes);
			this.updateTree(update.view);
		} else if (update.viewportChanged) {
			this.decorations = this.renderDecorations(update.view);
		} else if (update.selectionSet) {
			this.updateTree(update.view);
		}
	}

	destroy(): void {
		this.decorations = Decoration.none;
	}

	private updateTree(view: EditorView) {
		getSteamGuardCodeAnchorsAst(view).forEach((it) => {
			if (this.isShouldRenderNode(view, it)) {
				this.addDecoration(it, view);
			} else {
				this.removeDecoration(it);
			}
		});
	}

	private renderDecorations(view: EditorView): DecorationSet {
		const widgets: Range<Decoration>[] = [];

		getSteamGuardCodeAnchorsAst(view).forEach((it) => {
			if (this.isShouldRenderNode(view, it)) {
				const decoration = this.createDecoration(it, view);
				if (decoration) widgets.push(decoration);
			}
		});

		return Decoration.set(widgets, true);
	}

	private isShouldRenderNode(view: EditorView, node: SyntaxNodeRef): boolean {
		const start = node.from;
		const end = node.to;
		const sel = view.state.selection;
		return !this.isSelectionOverlapsRanges(sel, start - 1, end + 1);
	}

	private createDecoration(node: SyntaxNodeRef, view: EditorView): Range<Decoration> | undefined {
		const start = node.from;
		const end = node.to;

		if (view.state.doc.sliceString(end, end + 1) === "\n") {
			return;
		}

		const text = view.state.doc.sliceString(start, end);
		const sharedSecret = getSteamGuardCodeSharedSecret(text);

		return Decoration.replace({
			widget: new SteamGuardCodeWidget({ sharedSecret }),
			inclusive: false,
			block: false
		}).range(start - 1, end + 1);
	}

	private addDecoration(node: SyntaxNodeRef, view: EditorView) {
		const from = node.from - 1;
		const to = node.to + 1;
		if (!this.hasDecoration(from, to)) {
			const file = view.state.field(editorInfoField as unknown as StateField<unknown>);
			if (!file) return;
			const decoration = this.createDecoration(node, view)?.value;
			if (decoration) {
				this.decorations = this.decorations.update({
					add: [{ from, to, value: decoration }]
				});
			}
		}
	}

	private hasDecoration(from: number, to: number): boolean {
		let exists = false;
		this.decorations.between(from, to, () => {
			exists = true;
		});
		return exists;
	}

	private removeDecoration(node: SyntaxNodeRef) {
		this.decorations.between(node.from - 1, node.to + 1, (from, to) => {
			this.decorations = this.decorations.update({
				filterFrom: from,
				filterTo: to,
				filter: () => false
			});
		});
	}

	private isSelectionOverlapsRanges(sel: EditorSelection, from: number, to: number) {
		return sel.ranges.some((it) => it.from <= to && it.to >= from);
	}
}
