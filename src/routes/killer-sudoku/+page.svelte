<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
</script>

<div class="app-container">
	<header>
		<h1>Killer Sudoku Solver</h1>
		<p>Built with SvelteKit + Web Workers</p>
	</header>

	<main>
		<Grid />
		<ControlPanel />
	</main>
</div>

<style>
	.app-container {
		max-width: 1000px;
		margin: 0 auto;
		font-family: system-ui, -apple-system, sans-serif;
	}
	header {
		text-align: center;
		margin-bottom: 40px;
	}
	main {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 40px;
	}
	@media (max-width: 800px) {
		main {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
