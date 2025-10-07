import { syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import { type SyntaxNodeRef } from "@lezer/common";
import type { MarkdownPostProcessorContext } from "obsidian";

import SteamGuardCode from "$components/SteamGuardCode/SteamGuardCode.svelte";
import { MarkdownRenderComponent } from "$lib/component.js";

/** Pattern of a `::steam-guard-code::<SHARED SECRET>` anchor. */
const steamGuardCodeAnchorPattern = /^::steam-guard-code::(.+)$/;

/**
 * Thrown when SteamGuardCode anchor (inline code span) is invalid.
 */
export class InvalidSteamGuardCodeAnchorError extends Error {}

/**
 * Gets shared secret from the anchor inline code span.
 * @param text inline code span text, conforming to the pattern
 * @throws {InvalidSteamGuardCodeAnchorError} if {@link text} does not match a pattern
 * @returns shared secret extracted from the inline code
 */
export function getSteamGuardCodeSharedSecret(text: string): string {
	const match = steamGuardCodeAnchorPattern.exec(text);
	if (!match) throw new InvalidSteamGuardCodeAnchorError();
	return match[1].trim();
}

/**
 * Finds all matching inline code spans that contain matching pattern for SteamGuardCode.
 * @param root root DOM element to search inline code spans in
 * @returns array of {@link Element} matching the SteamGuardCode anchor pattern
 * @see getSteamGuardCodeAnchorsAst
 */
export function getSteamGuardCodeAnchorsDom(root: Element): Element[] {
	return [...root.querySelectorAll("code")].filter((it) =>
		steamGuardCodeAnchorPattern.test(it.textContent)
	);
}

/**
 * Finds all matching inline code spans that contain matching pattern for SteamGuardCode.
 * @param view {@link EditorView} to search inline code spans in
 * @returns array of {@link SyntaxNodeRef} matching the SteamGuardCode anchor pattern
 * @see getSteamGuardCodeAnchorsDom
 */
export function getSteamGuardCodeAnchorsAst(view: EditorView): SyntaxNodeRef[] {
	const nodes: SyntaxNodeRef[] = [];

	for (const range of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from: range.from,
			to: range.to,
			enter: (node) => {
				if (node.type.name === "inline-code") {
					const text = view.state.doc.sliceString(node.from, node.to);
					if (steamGuardCodeAnchorPattern.test(text)) {
						nodes.push(node.node);
					}
				}
			}
		});
	}

	return nodes;
}

/**
 * Markdown post-processing function to include {@link SteamGuardCode}
 * component in place of anchor inline spans.
 * @param el {@link HTMLElement} to search for anchor elements in
 * @param ctx post processing context
 */
export function SteamGuardCodeMarkdownPostProcessor(
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext
) {
	getSteamGuardCodeAnchorsDom(el).forEach((it) => {
		const sharedSecret = getSteamGuardCodeSharedSecret(it.textContent);
		const anchor = document.createElement("span");
		it.replaceWith(anchor);
		ctx.addChild(
			new MarkdownRenderComponent(SteamGuardCode, {
				target: anchor,
				props: {
					sharedSecret
				}
			})
		);
	});
}
