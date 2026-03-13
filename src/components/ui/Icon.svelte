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
Simple component to include Lucide (Obsidian builtin) icons.
@component
-->

<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	interface Props {
		/**
		 * Lucide icon set name of the icon.
		 */
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
