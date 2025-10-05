<script lang="ts">
	import Icon from "./Icon.svelte";

	interface Props {
		text: string | undefined;
	}

	let { text }: Props = $props();

	async function onclick() {
		if (text) {
			await navigator.clipboard.writeText(text);
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
