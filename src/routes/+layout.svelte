<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/stores/theme';
	import '$lib/styles/themes.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-wrapper {$themeStore}">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.app-wrapper {
		min-height: 100vh;
		background-color: var(--color-bg);
		color: var(--color-text);
		font-family: var(--font-main);
		transition: background-color 0.4s ease, color 0.4s ease;
	}
</style>
