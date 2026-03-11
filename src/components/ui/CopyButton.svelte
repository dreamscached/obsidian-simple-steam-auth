<!--
Simple Steam Auth - Generate Steam Guard codes right in your vault.
Copyright (C) 2026 dreamscached <dreamscache.d@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<!--
Simple copy button, used to copy text content on click.
@component
-->

<script lang="ts">
	import { Notice } from "obsidian";
	import Icon from "./Icon.svelte";

	// i18next is available globally from Obsidian itself for builtin translations
	import { type i18n as i18nextType } from "i18next";
	const obsidianI18n = (window as any).i18next as i18nextType;

	interface Props {
		/** Text content to copy. */
		text: string;
		/** Whether a button is enabled. */
		disabled?: HTMLButtonElement["disabled"];
	}

	let { text, disabled }: Props = $props();

	async function onclick() {
		if (text) {
			await navigator.clipboard.writeText(text);
			new Notice(obsidianI18n.t("interface.copied_generic"));
		}
	}
</script>

<button class="sg-copy-btn" {disabled} {onclick}>
	<Icon icon="copy" />
</button>

<style>
	.sg-copy-btn {
		padding: var(--size-4-1) var(--size-4-2);
	}
</style>
