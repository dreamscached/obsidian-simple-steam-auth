import { syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import { type SyntaxNodeRef } from "@lezer/common";

const steamGuardCodeAnchorPattern = /^::steam-guard-code::(.+)$/;

export function getSteamGuardCodeSharedSecret(text: string): string {
	const match = steamGuardCodeAnchorPattern.exec(text);
	if (!match) throw new Error("invalid syntax");
	return match[1].trim();
}

export function getSteamGuardCodeAnchorsDom(root: Element): Element[] {
	return [...root.querySelectorAll("code")].filter((it) =>
		steamGuardCodeAnchorPattern.test(it.textContent)
	);
}

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
						nodes.push(node);
					}
				}
			}
		});
	}

	return nodes;
}
