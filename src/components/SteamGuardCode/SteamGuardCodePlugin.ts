/*
 * Simple Steam Auth - Generate Steam Guard codes right in your vault.
 * Copyright (C) 2026 dreamscached <dreamscache.d@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { syntaxTree } from "@codemirror/language";
import { EditorSelection, type Extension, Range } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin } from "@codemirror/view";
import type { DecorationSet, PluginValue, ViewUpdate } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import { editorLivePreviewField } from "obsidian";

import { getSteamGuardCodeAnchorsAst, getSteamGuardCodeSharedSecret } from "$lib/common.js";

import type SimpleSteamAuthPlugin from "../../main.js";

import { SteamGuardCodeWidget } from "./SteamGuardCodeWidget.js";

/**
 * CodeMirror ViewPlugin (created using {@link createViewPlugin}) to mount
 * {@link SteamGuardCodeWidget} onto the Markdown editor.
 */
export class SteamGuardCodePlugin implements PluginValue {
	private readonly plugin: SimpleSteamAuthPlugin;
	private decorations: DecorationSet;

	private constructor(plugin: SimpleSteamAuthPlugin, view: EditorView) {
		this.plugin = plugin;
		this.decorations = this.buildDecorations(view);
	}

	/**
	 * Creates a ViewPlugin instance wrapping this class.
	 * @param plugin Simple Steam Auth plugin
	 * @returns CodeMirror {@link ViewPlugin} instance wrapping this class
	 */
	static createViewPlugin(plugin: SimpleSteamAuthPlugin): Extension {
		return ViewPlugin.fromClass(
			class extends SteamGuardCodePlugin {
				constructor(view: EditorView) {
					super(plugin, view);
				}
			},
			{
				decorations: (it) => it.decorations
			}
		);
	}

	update(update: ViewUpdate): void {
		// @ts-expect-error some quirk because this doesn't happen on ^6.5.4 of @codemirror/state
		const livePreview = update.state.field(editorLivePreviewField) as boolean;
		if (!livePreview) {
			this.decorations = Decoration.none;
			return;
		}

		// @ts-expect-error some quirk because this doesn't happen on ^6.5.4 of @codemirror/state
		const livePreviewToggled = update.startState.field(editorLivePreviewField) !== livePreview;
		// The tree parses incrementally and can lag an edit by an update or two.
		const treeChanged = syntaxTree(update.startState) !== syntaxTree(update.state);

		if (
			update.docChanged ||
			update.viewportChanged ||
			update.selectionSet ||
			treeChanged ||
			livePreviewToggled
		) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy(): void {
		this.decorations = Decoration.none;
	}

	// Rebuilt in full rather than patched: patching can only remove decorations
	// whose anchor is still in the tree, so a widget outlives an anchor that
	// stopped parsing and keeps replacing text. Widget eq() prevents re-mounting.
	private buildDecorations(view: EditorView): DecorationSet {
		const widgets: Range<Decoration>[] = [];

		getSteamGuardCodeAnchorsAst(view).forEach((it) => {
			const decoration = this.createDecoration(it, view);
			if (decoration) widgets.push(decoration);
		});

		return Decoration.set(widgets, true);
	}

	private createDecoration(node: SyntaxNodeRef, view: EditorView): Range<Decoration> | undefined {
		// Node spans the code span contents, the decoration replaces backticks too.
		const from = node.from - 1;
		const to = node.to + 1;

		if (!this.isDelimitedByBackticks(view, from, to)) {
			return;
		}

		// A replacing decoration pushes the caret out of its range, so leave the
		// anchor as plain Markdown while the caret is on it.
		// @ts-expect-error typing quirk because this doesn't happen on ^6.38.6 of @codemirror/view
		if (this.isSelectionOverlapsRange(view.state.selection, from, to)) {
			return;
		}

		const text = view.state.doc.sliceString(node.from, node.to);
		const sharedSecret = getSteamGuardCodeSharedSecret(text);

		return Decoration.replace({
			widget: new SteamGuardCodeWidget(this.plugin, { sharedSecret }),
			inclusive: false,
			block: false
		}).range(from, to);
	}

	// Unterminated spans are reported as running to the end of the line, and
	// replacing one would swallow the line break.
	private isDelimitedByBackticks(view: EditorView, from: number, to: number): boolean {
		const doc = view.state.doc;
		if (from < 0 || to > doc.length) return false;
		return doc.sliceString(from, from + 1) === "`" && doc.sliceString(to - 1, to) === "`";
	}

	private isSelectionOverlapsRange(sel: EditorSelection, from: number, to: number): boolean {
		return sel.ranges.some((it) => it.from <= to && it.to >= from);
	}
}
