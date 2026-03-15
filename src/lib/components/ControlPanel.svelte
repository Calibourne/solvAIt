<script lang="ts">
	import { gridStore } from '$lib/stores/grid';
	import { onMount } from 'svelte';

	let worker: Worker;

	onMount(() => {
		// Vite handles workers with ?worker suffix or new Worker(new URL(...))
		const SolverWorker = import.meta.glob('$lib/solver/worker.ts', {
			eager: true,
			query: '?worker'
		});
		const workerConstructor = Object.values(SolverWorker)[0] as any;
		worker = new workerConstructor.default();

		worker.onmessage = (e) => {
			const { type, payload } = e.data;
			if (type === 'STEP') {
				gridStore.applyStep(payload);
			} else if (type === 'DONE') {
				if (payload.status === 'solved') {
					gridStore.setSolution(payload.solution);
					gridStore.setStats(payload.stats);
				} else {
					alert('No solution found!');
					gridStore.setSolving(false);
				}
			}
		};
	});

	function handleSolve() {
		gridStore.setSolving(true);
		worker.postMessage({
			grid: $gridStore.grid,
			cages: $gridStore.cages,
			mode: $gridStore.solveMode,
			visualize: $gridStore.visualize
		});
	}

	function handleAddCage() {
		const sumStr = prompt('Enter cage sum:');
		const sum = parseInt(sumStr || '');
		if (!isNaN(sum)) {
			gridStore.addCage(sum);
		}
	}
</script>

<div class="controls">
	<div class="section">
		<h3>Editor</h3>
		<button on:click={() => gridStore.toggleEditMode()}>
			{$gridStore.isEditMode ? 'Done Editing' : 'Edit Cages'}
		</button>

		{#if $gridStore.isEditMode}
			<button on:click={() => gridStore.toggleNewCageMode()}>
				{$gridStore.isNewCageMode ? 'Confirm Selection' : 'New Cage'}
			</button>
			{#if $gridStore.isNewCageMode && $gridStore.selectedCells.length > 0}
				<button on:click={handleAddCage}>Set Sum</button>
			{/if}
		{/if}
	</div>

	<div class="section">
		<h3>Solver</h3>
		<select bind:value={$gridStore.solveMode}>
			<option value="tiered">Tiered (Auto)</option>
			<option value="heuristic">Heuristics Only</option>
			<option value="csp">CSP</option>
			<option value="backtracking">Backtracking</option>
		</select>

		<label>
			<input type="checkbox" bind:checked={$gridStore.visualize} />
			Visualize
		</label>

		<button on:click={handleSolve} disabled={$gridStore.isSolving}>
			{$gridStore.isSolving ? 'Solving...' : 'Solve'}
		</button>

		<button on:click={() => gridStore.reset()} disabled={$gridStore.isSolving}> Reset </button>
	</div>

	{#if $gridStore.stats}
		<div class="section stats">
			<h3>Stats</h3>
			<p>Time: {$gridStore.stats.timeMs.toFixed(2)}ms</p>
			<p>Iterations: {$gridStore.stats.iterations}</p>
		</div>
	{/if}
</div>

<style>
	.controls {
		padding: 20px;
		background: #f4f4f4;
		border-radius: 8px;
		width: 250px;
	}
	.section {
		margin-bottom: 20px;
	}
	h3 {
		margin-top: 0;
		font-size: 1rem;
		color: #555;
	}
	button {
		display: block;
		width: 100%;
		padding: 8px;
		margin-bottom: 5px;
		cursor: pointer;
	}
	select {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
	}
	label {
		display: block;
		margin-bottom: 10px;
		font-size: 0.9rem;
	}
	.stats p {
		margin: 5px 0;
		font-size: 0.9rem;
	}
</style>
