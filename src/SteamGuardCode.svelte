<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import SteamTotp from "steam-totp";
	import Icon from "./Icon.svelte";

	interface Props {
		sharedSecret: string;
	}

	let { sharedSecret }: Props = $props();

	let updateInterval = $state<ReturnType<typeof setInterval> | undefined>();
	let authCode = $state<string | undefined>();

	async function updateAuthCode() {
		authCode = await SteamTotp.getAuthCode(sharedSecret);
	}

	onMount(async () => {
		updateInterval = setInterval(updateAuthCode, 1e3);
		await updateAuthCode();
	});

	onDestroy(() => {
		clearInterval(updateInterval);
	});

	async function onCopyButtonClick(e: Event) {
		await navigator.clipboard.writeText(authCode!);
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<div class="sg-container">
	<span class="sg-totp-code">
		{authCode}
	</span>
	<button class="sg-copy-btn" onclick={onCopyButtonClick}>
		<Icon icon="copy" />
	</button>
</div>

<style>
	.sg-container {
		padding: var(--size-4-1);
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		gap: var(--size-4-1);
	}

	.sg-totp-code {
		font-family: var(--font-monospace);
		font-size: var(--font-text-size);
	}

	.sg-copy-btn {
		padding: var(--size-4-1) var(--size-4-2);
	}
</style>
