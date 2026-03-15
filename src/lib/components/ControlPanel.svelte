<script lang="ts">
	import { gridStore } from '$lib/stores/grid';
	import { onMount } from 'svelte';

	let worker: Worker;
	let cageSumInput: number | null = null;
	let showResetMenu = false;

	onMount(() => {
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

	function triggerCageModal() {
		cageSumInput = null;
		gridStore.setShowSumModal(true);
	}

	function confirmCage() {
		if (cageSumInput !== null && cageSumInput > 0) {
			gridStore.addCage(cageSumInput);
		}
	}

	function cancelCage() {
		gridStore.setShowSumModal(false);
	}

	function handleReset(type: 'all' | 'solution' | 'grid' | 'cages') {
		if (type === 'all') gridStore.reset();
		if (type === 'solution') gridStore.resetSolution();
		if (type === 'grid') gridStore.resetGrid();
		if (type === 'cages') gridStore.resetCages();
		showResetMenu = false;
	}
</script>

<div class="controls">
	<div class="section">
		<h3>Editor</h3>
		<button on:click={() => gridStore.toggleEditMode()} class:active={$gridStore.isEditMode}>
			{$gridStore.isEditMode ? 'Done Editing' : 'Edit Cages'}
		</button>

		{#if $gridStore.isEditMode}
			<button
				on:click={() => gridStore.toggleNewCageMode()}
				class:active={$gridStore.isNewCageMode}
			>
				{$gridStore.isNewCageMode ? 'Confirm Selection' : 'New Cage'}
			</button>
			{#if $gridStore.isNewCageMode && $gridStore.selectedCells.length > 0}
				<button on:click={triggerCageModal} class="primary">Set Sum</button>
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

		<label class="checkbox-label">
			<input type="checkbox" bind:checked={$gridStore.visualize} />
			Visualize
		</label>

		<button on:click={handleSolve} disabled={$gridStore.isSolving} class="primary">
			{$gridStore.isSolving ? 'Solving...' : 'Solve'}
		</button>
	</div>

	<div class="section reset-section">
		<button class="reset-toggle" on:click={() => (showResetMenu = !showResetMenu)}>
			Reset Options {showResetMenu ? '▲' : '▼'}
		</button>
		{#if showResetMenu}
			<div class="reset-menu">
				<button on:click={() => handleReset('solution')}>Clear Solution</button>
				<button on:click={() => handleReset('grid')}>Clear All Numbers</button>
				<button on:click={() => handleReset('cages')}>Clear All Cages</button>
				<button on:click={() => handleReset('all')} class="danger">Reset Everything</button>
			</div>
		{/if}
	</div>

	{#if $gridStore.stats}
		<div class="section stats">
			<h3>Stats</h3>
			<p>Time: {$gridStore.stats.timeMs.toFixed(2)}ms</p>
			<p>Iterations: {$gridStore.stats.iterations}</p>
		</div>
	{/if}
</div>

{#if $gridStore.showSumModal}
	<div class="modal-backdrop" on:click={cancelCage}>
		<div class="modal-content" on:click|stopPropagation>
			<h4>New Cage Sum</h4>
			<p>Selected cells: {$gridStore.selectedCells.length}</p>
			<input
				type="number"
				bind:value={cageSumInput}
				placeholder="Enter sum"
				on:keydown={(e) => e.key === 'Enter' && confirmCage()}
				autofocus
			/>
			<div class="modal-actions">
				<button on:click={cancelCage}>Cancel</button>
				<button on:click={confirmCage} class="primary" disabled={!cageSumInput || cageSumInput <= 0}>
					Confirm
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.controls {
		padding: 20px;
		background: #fff;
		border-radius: 12px;
		width: 250px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		border: 1px solid #eee;
	}
	.section {
		margin-bottom: 24px;
	}
	h3 {
		margin-top: 0;
		margin-bottom: 12px;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
	}
	button {
		display: block;
		width: 100%;
		padding: 10px;
		margin-bottom: 8px;
		cursor: pointer;
		border: 1px solid #ddd;
		background: white;
		border-radius: 6px;
		font-weight: 500;
		transition: all 0.2s;
		text-align: center;
	}
	button:hover:not(:disabled) {
		background: #f8f8f8;
		border-color: #ccc;
	}
	button.active {
		background: #e7f3ff;
		border-color: #007bff;
		color: #007bff;
	}
	button.primary {
		background: #007bff;
		color: white;
		border-color: #007bff;
	}
	button.primary:hover:not(:disabled) {
		background: #0056b3;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	select {
		width: 100%;
		padding: 10px;
		margin-bottom: 12px;
		border-radius: 6px;
		border: 1px solid #ddd;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 15px;
		font-size: 0.9rem;
		color: #444;
		cursor: pointer;
	}

	/* Reset Section */
	.reset-toggle {
		font-size: 0.9rem;
		color: #666;
		background: #f9f9f9;
	}
	.reset-menu {
		margin-top: 8px;
		padding: 10px;
		background: #fdfdfd;
		border: 1px solid #eee;
		border-radius: 8px;
	}
	.reset-menu button {
		padding: 6px;
		font-size: 0.85rem;
		margin-bottom: 4px;
	}
	.reset-menu button.danger {
		color: #dc3545;
		border-color: #ffcfcf;
	}
	.reset-menu button.danger:hover {
		background: #fff5f5;
	}

	.stats p {
		margin: 6px 0;
		font-size: 0.9rem;
		color: #555;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}
	.modal-content {
		background: white;
		padding: 24px;
		border-radius: 12px;
		width: 300px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	}
	.modal-content h4 {
		margin: 0 0 8px 0;
	}
	.modal-content p {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 16px;
	}
	.modal-content input {
		width: 100%;
		padding: 12px;
		margin-bottom: 20px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1.1rem;
		box-sizing: border-box;
	}
	.modal-actions {
		display: flex;
		gap: 10px;
	}
</style>
