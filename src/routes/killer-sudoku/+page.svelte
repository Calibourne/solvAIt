<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
</script>

<div class="app-container">
	<header>
		<h1 class="noir-title">CASE_FILE_#09Sudoku</h1>
		<div class="noir-badge">REDACTED // CRIME_SCENE_INV_01</div>
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
		padding: 40px;
	}
	header {
		text-align: center;
		margin-bottom: 50px;
	}
	.noir-title {
		font-size: 3rem;
		font-weight: 900;
		margin: 0;
		text-transform: uppercase;
		background: #000;
		color: #fff;
		padding: 10px 20px;
		display: inline-block;
		transform: rotate(-1deg);
		box-shadow: 4px 4px 0 var(--color-primary);
	}
	.noir-badge {
		display: block;
		margin-top: 15px;
		font-weight: bold;
		font-size: 0.8rem;
		opacity: 0.7;
		text-decoration: line-through;
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
