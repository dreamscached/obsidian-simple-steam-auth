<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	interface Props {
		icon: string;
	}

	let { icon }: Props = $props();

	let anchor: HTMLSpanElement;

	onMount(() => {
		setIcon(anchor, icon);
	});
</script>

<span bind:this={anchor} class={"sg-icon"}></span>

<style>
	.sg-icon {
		height: var(--icon-m);
		aspect-ratio: 1/1;
	}
</style>
