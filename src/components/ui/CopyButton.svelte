<!--
Simple copy button, used to copy text content on click.
@component
-->

<script lang="ts">
	import { Notice } from "obsidian";
	import Icon from "./Icon.svelte";
	import i18n from "i18next";

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
			// TODO i18n
			new Notice(i18n.t("component.copyButton.copy.notice"));
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
