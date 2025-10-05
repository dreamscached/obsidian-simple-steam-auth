<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import SteamTotp from "steam-totp";
	import { getSettings } from "$lib/settings/settings.svelte";
	import CopyButton from "$components/ui/CopyButton.svelte";

	interface Props {
		sharedSecret: string;
	}

	let { sharedSecret }: Props = $props();

	let pluginSettings = getSettings();
	let updateInterval = $state<ReturnType<typeof setInterval> | undefined>();
	let authCode = $state<string | undefined>();
	let reveal = $state(false);

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

	function onCodeSpanMouseOver() {
		reveal = true;
	}

	function onCodeSpanMouseLeave() {
		if (!pluginSettings.showCodeByDefault) {
			reveal = false;
		}
	}
</script>

<div class="sg-container">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span
		class={["sg-totp-code", { "sg-totp-code-hidden": !reveal }]}
		onfocus={onCodeSpanMouseOver}
		onblur={onCodeSpanMouseLeave}
		onmouseover={onCodeSpanMouseOver}
		onmouseleave={onCodeSpanMouseLeave}
	>
		{#if reveal || pluginSettings.showCodeByDefault}
			{authCode}
		{:else}
			*****
		{/if}
	</span>
	{#if pluginSettings.showCopyButton}
		<CopyButton text={authCode} />
	{/if}
</div>

<style>
	.sg-container {
		padding: var(--size-4-1);
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		gap: var(--size-4-2);
	}

	.sg-totp-code {
		font-family: var(--font-monospace);
		font-size: var(--font-text-size);
	}

	.sg-totp-code-hidden {
		color: var(--text-muted);
	}
</style>
