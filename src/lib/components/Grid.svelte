<script lang="ts">
	import { gridStore, conflicts } from '$lib/stores/grid';

	const rows = Array(9).fill(0);
	const cols = Array(9).fill(0);

	function handleCellClick(r: number, c: number) {
		if ($gridStore.isEditMode) {
			if ($gridStore.isNewCageMode) {
				gridStore.selectCell(r, c);
			} else if ($gridStore.editingCageIndex !== null) {
                // If we are currently editing a specific cage's cells
                gridStore.selectCell(r, c);
            } else {
				// Click an existing cage to edit it
				const cageIndex = $gridStore.cages.findIndex((cage) =>
					cage.cells.some((cell) => cell[0] === r && cell[1] === c)
				);
				if (cageIndex !== -1) {
					gridStore.setEditingCageIndex(cageIndex);
                    gridStore.setShowSumModal(true);
				}
			}
		}
	}

	function handleInput(r: number, c: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const val = parseInt(target.value);
		if (!isNaN(val) && val >= 1 && val <= 9) {
			gridStore.setCell(r, c, val);
		} else {
			gridStore.setCell(r, c, 0);
			target.value = '';
		}
	}

	function getCellCageColor(r: number, c: number) {
		const cageIndex = $gridStore.cages.findIndex((cage) =>
			cage.cells.some((cell) => cell[0] === r && cell[1] === c)
		);
		if (cageIndex === -1) return '';
		
		const cageVar = `--theme-pop-cage-${(cageIndex % 4) + 1}`;
		return `var(${cageVar})`;
	}

	function isSelected(r: number, c: number) {
		return $gridStore.selectedCells.some((cell) => cell[0] === r && cell[1] === c);
	}

	function isFirstInCage(r: number, c: number) {
		const cage = $gridStore.cages.find((cage) =>
			cage.cells.some((cell) => cell[0] === r && cell[1] === c)
		);
		if (!cage) return false;
		return cage.cells[0][0] === r && cage.cells[0][1] === c;
	}

	function getCageSum(r: number, c: number) {
		const cage = $gridStore.cages.find((cage) =>
			cage.cells.some((cell) => cell[0] === r && cell[1] === c)
		);
		return cage?.sum;
	}

	function getCellStrategyClass(r: number, c: number) {
		const meta = $gridStore.metadata[r][c];
		if (meta.isUserInput) return 'user-input';
		if (meta.strategy) return `strategy-${meta.strategy}`;
		return '';
	}

	function isConflict(r: number, c: number) {
		return $conflicts.has(`${r},${c}`);
	}
</script>

<div class="grid-container">
	<table id="sudoku-grid">
		<tbody>
			{#each rows as _, r}
				<tr>
					{#each cols as _, c}
						<td
							style="background-color: {getCellCageColor(r, c)}"
							class:selected={isSelected(r, c)}
							class:conflict={isConflict(r, c)}
							class:edit-mode={$gridStore.isEditMode}
							class={getCellStrategyClass(r, c)}
							on:click={() => handleCellClick(r, c)}
						>
							{#if isFirstInCage(r, c)}
								<span class="cage-sum">{getCageSum(r, c)}</span>
							{/if}
							<input
								type="number"
								min="1"
								max="9"
								value={$gridStore.grid[r][c] || ''}
								on:input={(e) => handleInput(r, c, e)}
								disabled={$gridStore.isSolving || $gridStore.isEditMode}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.grid-container {
		display: flex;
		justify-content: center;
		padding: 20px 0;
	}
	table {
		border-collapse: collapse;
		border: var(--border-weight) solid var(--color-text);
		box-shadow: var(--effect-primary);
		border-radius: var(--border-radius);
		overflow: hidden;
	}
	td {
		width: 44px;
		height: 44px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		padding: 0;
		transition: background-color 0.2s, box-shadow 0.2s;
		cursor: pointer;
		background-color: var(--color-surface);
	}
	td.edit-mode:hover {
		background-color: rgba(179, 0, 0, 0.1) !important;
	}
	input {
		width: 100%;
		height: 100%;
		border: none;
		text-align: center;
		font-size: 1.3rem;
		background: transparent;
		color: var(--color-text);
		font-weight: 900;
		font-family: var(--font-main);
	}
	/* Detective Theme specific stamp effect */
	.theme-pop input {
		transform: rotate(-2deg);
		filter: contrast(1.2) opacity(0.8);
	}
	/* Ensure input doesn't block click in edit mode */
	td.edit-mode input {
		pointer-events: none;
	}
	input:focus {
		outline: none;
		background: rgba(0, 0, 0, 0.05);
	}
	/* Thick borders for 3x3 boxes */
	tr:nth-child(3n) td {
		border-bottom: var(--border-weight) solid var(--color-text);
	}
	td:nth-child(3n) {
		border-right: var(--border-weight) solid var(--color-text);
	}
	/* Tron theme specific double border */
	.theme-synth table {
		border: 4px double var(--color-primary);
	}
	.selected {
		outline: var(--border-weight) solid var(--color-primary) !important;
		outline-offset: calc(var(--border-weight) * -1);
		z-index: 10;
		background-color: rgba(179, 0, 0, 0.2) !important;
	}
	/* Matrix theme specific selection */
	.theme-matrix .selected {
		background-color: rgba(0, 255, 65, 0.2) !important;
		outline-color: var(--color-primary) !important;
	}
	.conflict {
		background-color: rgba(220, 53, 69, 0.3) !important;
	}
	.conflict input {
		color: #dc3545 !important;
	}
	.cage-sum {
		position: absolute;
		top: 2px;
		left: 3px;
		font-size: 0.7rem;
		font-weight: 900;
		color: var(--color-primary);
		pointer-events: none;
		z-index: 5;
	}
	/* Strategy-based coloring */
	td.user-input input {
		color: var(--color-text);
	}
	td.strategy-heuristic input {
		color: #28a745; /* Keep functional colors distinct but high contrast */
	}
	td.strategy-csp input {
		color: #007bff;
	}
	td.strategy-backtracking input {
		color: #6f42c1;
	}

	/* Remove arrows from number input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
