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

	// Reactively sync input value when editing starts
	$: if ($gridStore.showSumModal && $gridStore.editingCageIndex !== null) {
		cageSumInput = $gridStore.cages[$gridStore.editingCageIndex].sum;
	} else if ($gridStore.showSumModal && $gridStore.editingCageIndex === null) {
		cageSumInput = null;
	}

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
		gridStore.setShowSumModal(true);
	}

	function confirmCage() {
		const { min, max } = getCageBounds($gridStore.selectedCells.length);
		if (cageSumInput !== null && cageSumInput >= min && cageSumInput <= max) {
			if ($gridStore.editingCageIndex !== null) {
				gridStore.updateCage($gridStore.editingCageIndex, cageSumInput, $gridStore.selectedCells);
			} else {
				gridStore.addCage(cageSumInput);
			}
            gridStore.setShowSumModal(false);
		}
	}

	function handleDeleteCage() {
		if ($gridStore.editingCageIndex !== null) {
			gridStore.removeCage($gridStore.editingCageIndex);
			gridStore.setShowSumModal(false);
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

	function getCageBounds(size: number) {
		let min = 0;
		for (let i = 1; i <= size; i++) min += i;
		let max = 0;
		for (let i = 9; i > 9 - size; i--) max += i;
		return { min, max };
	}

	$: bounds = getCageBounds($gridStore.selectedCells.length);
	$: isSumValid = cageSumInput !== null && cageSumInput >= bounds.min && cageSumInput <= bounds.max;
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
			<h4>{$gridStore.editingCageIndex !== null ? 'Edit Cage' : 'New Cage Sum'}</h4>
			<p>Selected cells: <strong>{$gridStore.selectedCells.length}</strong></p>
			<p class="range-info">Allowed range: <strong>{bounds.min} - {bounds.max}</strong></p>
			<input
				type="number"
				bind:value={cageSumInput}
				placeholder="Enter sum"
				on:keydown={(e) => e.key === 'Enter' && isSumValid && confirmCage()}
				autofocus
				class:invalid={cageSumInput !== null && !isSumValid}
			/>
			<div class="modal-actions">
				<button on:click={cancelCage}>Cancel</button>
				{#if $gridStore.editingCageIndex !== null}
					<button on:click={handleDeleteCage} class="danger">Delete</button>
				{/if}
				<button on:click={confirmCage} class="primary" disabled={!isSumValid}>
					{$gridStore.editingCageIndex !== null ? 'Update' : 'Confirm'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.controls {
		padding: 24px;
		background: var(--color-surface);
		border-radius: var(--border-radius);
		width: 280px;
		box-shadow: var(--effect-primary);
		border: var(--border-weight) solid var(--color-text);
	}
	.section {
		margin-bottom: 24px;
	}
	h3 {
		margin-top: 0;
		margin-bottom: 12px;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-text);
		opacity: 0.7;
		font-weight: 900;
		font-family: var(--font-main);
	}
	button {
		display: block;
		width: 100%;
		padding: 12px;
		margin-bottom: 10px;
		cursor: pointer;
		border: var(--border-weight) solid var(--color-text);
		background: var(--color-surface);
		border-radius: var(--border-radius);
		font-weight: 900;
		font-size: 0.9rem;
		transition: all 0.2s;
		text-align: center;
		color: var(--color-text);
		font-family: var(--font-main);
		text-transform: uppercase;
	}
	button:hover:not(:disabled) {
		background: var(--color-bg);
		transform: translate(-2px, -2px);
		box-shadow: 2px 2px 0 var(--color-text);
	}
	button.active {
		background: var(--color-primary);
		color: white;
	}
	button.primary {
		background: var(--color-primary);
		color: white;
	}
	button.primary:hover:not(:disabled) {
		background: var(--color-primary);
		filter: brightness(1.1);
	}
	button.danger {
		color: var(--color-primary);
		border-color: var(--color-primary);
	}
	button.danger:hover {
		background: rgba(179, 0, 0, 0.05);
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(1);
	}
	select {
		width: 100%;
		padding: 12px;
		margin-bottom: 12px;
		border-radius: var(--border-radius);
		border: var(--border-weight) solid var(--color-text);
		background: var(--color-surface);
		color: var(--color-text);
		font-weight: 900;
		font-family: var(--font-main);
		appearance: none;
		background-image: linear-gradient(45deg, transparent 50%, var(--color-text) 50%),
			linear-gradient(135deg, var(--color-text) 50%, transparent 50%);
		background-position: calc(100% - 20px) calc(1em + 4px), calc(100% - 15px) calc(1em + 4px);
		background-size: 5px 5px, 5px 5px;
		background-repeat: no-repeat;
		cursor: pointer;
		transition: all 0.2s;
		text-transform: uppercase;
	}
	select:hover {
		transform: translate(-2px, -2px);
		box-shadow: 2px 2px 0 var(--color-text);
	}
	select:focus {
		outline: none;
		border-color: var(--color-primary);
	}
	option {
		background: var(--color-surface);
		color: var(--color-text);
		font-weight: bold;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 15px;
		font-size: 0.9rem;
		color: var(--color-text);
		cursor: pointer;
		font-weight: bold;
	}

	/* Reset Section */
	.reset-toggle {
		font-size: 0.9rem;
		background: var(--color-bg);
		border-style: dashed;
	}
	.reset-menu {
		margin-top: 8px;
		padding: 10px;
		background: var(--color-surface);
		border: var(--border-weight) solid var(--color-text);
		border-radius: var(--border-radius);
	}
	.reset-menu button {
		padding: 8px;
		font-size: 0.85rem;
		margin-bottom: 6px;
		border-width: 1px;
	}

	.stats p {
		margin: 8px 0;
		font-size: 0.95rem;
		color: var(--color-text);
		font-weight: bold;
		font-family: var(--font-main);
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}
	.modal-content {
		background: var(--color-surface);
		padding: 30px;
		border-radius: var(--border-radius);
		width: 320px;
		box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.2);
		border: var(--border-weight) solid var(--color-text);
	}
	.modal-content h4 {
		margin: 0 0 12px 0;
		font-size: 1.2rem;
		font-weight: 900;
	}
	.modal-content p {
		font-size: 0.9rem;
		color: var(--color-text);
		margin-bottom: 6px;
		font-weight: bold;
	}
	.range-info {
		margin-bottom: 20px !important;
		opacity: 0.7;
	}
	.modal-content input {
		width: 100%;
		padding: 12px;
		margin-bottom: 24px;
		border: var(--border-weight) solid var(--color-text);
		border-radius: calc(var(--border-radius) / 2);
		font-size: 1.2rem;
		box-sizing: border-box;
		font-weight: 900;
	}
	.modal-content input.invalid {
		border-color: var(--color-primary);
		background-color: rgba(179, 0, 0, 0.05);
		color: var(--color-primary);
	}
	.modal-actions {
		display: flex;
		gap: 12px;
	}
</style>
