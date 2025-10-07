<!--
Simple copy button, used to copy text content on click.
@component
-->

<script lang="ts">
	import { Notice } from "obsidian";
	import Icon from "./Icon.svelte";

	interface Props {
		/**
		 * Text content to copy.
		 */
		text: string;
	}

	let { text }: Props = $props();

	async function onclick() {
		if (text) {
			await navigator.clipboard.writeText(text);
			// TODO i18n
			new Notice("Copied to your clipboard");
		}
	}
</script>

<button class="sg-copy-btn" {onclick}>
	<Icon icon="copy" />
</button>

<style>
	.sg-copy-btn {
		padding: var(--size-4-1) var(--size-4-2);
	}
</style>
