<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { themeStore } from '$lib/stores/theme';
	import '$lib/styles/themes.css';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-wrapper {$themeStore}">
	<Navigation />
	<div class="content-area">
		{@render children()}
	</div>
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
		display: flex;
	}

	.content-area {
		margin-left: 70px;
		flex-grow: 1;
		width: calc(100vw - 70px);
	}
</style>
