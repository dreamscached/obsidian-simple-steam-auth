<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import SteamTotp from "steam-totp";

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
</script>

<span>
	{authCode}
</span>
