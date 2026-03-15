<script lang="ts">
	import { gridStore, conflicts } from '$lib/stores/grid';

	const rows = Array(9).fill(0);
	const cols = Array(9).fill(0);

	function handleCellClick(r: number, c: number) {
		if ($gridStore.isEditMode) {
			if ($gridStore.isNewCageMode) {
				gridStore.selectCell(r, c);
			} else {
				// If clicking an existing cage cell, we might want to edit/remove it later
				const cageIndex = $gridStore.cages.findIndex((cage) =>
					cage.cells.some((cell) => cell[0] === r && cell[1] === c)
				);
				if (cageIndex !== -1 && confirm('Remove this cage?')) {
					gridStore.removeCage(cageIndex);
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
		const colors = [
			'rgba(255, 215, 0, 0.3)', // Gold
			'rgba(255, 160, 122, 0.3)', // Salmon
			'rgba(32, 178, 170, 0.3)', // Teal
			'rgba(147, 112, 219, 0.3)', // Purple
			'rgba(255, 99, 71, 0.3)', // Tomato
			'rgba(123, 104, 238, 0.3)', // SlateBlue
			'rgba(144, 238, 144, 0.3)' // LightGreen
		];
		return colors[cageIndex % colors.length];
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
		margin: 20px 0;
	}
	table {
		border-collapse: collapse;
		border: 2px solid #333;
	}
	td {
		width: 44px;
		height: 44px;
		border: 1px solid #ccc;
		position: relative;
		padding: 0;
		transition: background-color 0.2s, box-shadow 0.2s;
		cursor: pointer;
	}
	td.edit-mode:hover {
		background-color: rgba(0, 123, 255, 0.1) !important;
	}
	input {
		width: 100%;
		height: 100%;
		border: none;
		text-align: center;
		font-size: 1.3rem;
		background: transparent;
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
		border-bottom: 2px solid #333;
	}
	td:nth-child(3n) {
		border-right: 2px solid #333;
	}
	.selected {
		outline: 3px solid #007bff !important;
		outline-offset: -3px;
		z-index: 10;
		background-color: rgba(0, 123, 255, 0.4) !important;
	}
	.conflict {
		background-color: rgba(220, 53, 69, 0.3) !important;
	}
	.conflict input {
		color: #dc3545 !important;
	}
	.cage-sum {
		position: absolute;
		top: 1px;
		left: 2px;
		font-size: 0.65rem;
		font-weight: bold;
		color: #444;
		pointer-events: none;
		z-index: 5;
	}
	/* Strategy-based coloring */
	td.user-input input {
		font-weight: bold;
		color: #000;
	}
	td.strategy-heuristic input {
		color: #28a745; /* Green */
	}
	td.strategy-csp input {
		color: #007bff; /* Blue */
	}
	td.strategy-backtracking input {
		color: #6f42c1; /* Purple */
	}

	/* Remove arrows from number input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
