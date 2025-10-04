<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	interface Props {
		className?: HTMLElement["className"];
		icon: string;
	}

	let { className, icon }: Props = $props();

	let anchor: HTMLSpanElement;

	onMount(() => {
		setIcon(anchor, icon);
	});
</script>

<span bind:this={anchor} class={["sg-icon", className]}></span>

<style>
	.sg-icon {
		height: var(--icon-m);
		aspect-ratio: 1/1;
	}
</style>
