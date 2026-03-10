<script lang="ts">
	import { getContext, onMount } from "svelte";
	import SteamTotp from "steam-totp";

	import { getSettings } from "$lib/settings/settings.svelte";
	import CopyButton from "$components/ui/CopyButton.svelte";
	import { PLUGIN_CONTEXT } from "$lib/component";
	import SimpleSteamAuthPlugin from "../../main.js";

	const pluginInstance = getContext<SimpleSteamAuthPlugin>(PLUGIN_CONTEXT);
	const pluginSettings = getSettings();

	interface Props {
		/** Shared secret used to generate Steam Guard code. */
		sharedSecret: string;
	}

	let { sharedSecret }: Props = $props();
	let authCode = $state<string | undefined>();
	let error = $state<unknown | undefined>();
	let hovered = $state(false);
	let revealed = $derived(hovered || pluginSettings.showCodeByDefault);

	async function updateAuthCode() {
		try {
			authCode = await SteamTotp.getAuthCode(sharedSecret);
			error = undefined;
		} catch (e: unknown) {
			error = e;
		}
	}

	onMount(async () => {
		pluginInstance.events.on("refresh", updateAuthCode);
		await updateAuthCode();
	});
</script>

<div class="sg-container">
	{#if authCode && error === undefined}
		{@render authCodeSpan()}
	{:else if error !== undefined}
		{@render errorSpan()}
	{:else}
		{@render skeleton()}
	{/if}
	{@render copyButton()}
</div>

{#snippet authCodeSpan()}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span
		class={["sg-totp-code", { "sg-totp-code-hidden": !revealed }]}
		onfocus={() => (hovered = true)}
		onblur={() => (hovered = false)}
		onmouseover={() => (hovered = true)}
		onmouseleave={() => (hovered = false)}
	>
		{#if revealed}
			{authCode}
		{:else}
			*****
		{/if}
	</span>
{/snippet}

{#snippet errorSpan()}
	<span class="sg-totp-code-error">ERROR</span>
{/snippet}

{#snippet skeleton()}
	<span class="sg-totp-code">*****</span>
{/snippet}

{#snippet copyButton()}
	{#if pluginSettings.showCopyButton}
		<CopyButton text={`${authCode}`} disabled={error !== undefined} />
	{/if}
{/snippet}

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

	.sg-totp-code-error {
		font-family: var(--font-monospace);
		color: var(--color-red);
		display: inline-flex;
		flex-direction: row;
		align-items: center;
	}
</style>
