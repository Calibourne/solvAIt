<script lang="ts">
	import { gridStore } from '$lib/stores/grid';

	const rows = Array(9).fill(0);
	const cols = Array(9).fill(0);

	function handleCellClick(r: number, c: number) {
		if ($gridStore.isEditMode) {
			if ($gridStore.isNewCageMode) {
				gridStore.selectCell(r, c);
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
		const colors = ['#FFD700', '#FFA07A', '#20B2AA', '#9370DB', '#FF6347', '#7B68EE', '#90EE90'];
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
								disabled={$gridStore.isSolving || ($gridStore.isEditMode && $gridStore.isNewCageMode)}
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
		width: 40px;
		height: 40px;
		border: 1px solid #ccc;
		position: relative;
		padding: 0;
	}
	input {
		width: 100%;
		height: 100%;
		border: none;
		text-align: center;
		font-size: 1.2rem;
		background: transparent;
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
		outline: 3px solid #007bff;
		z-index: 10;
	}
	.cage-sum {
		position: absolute;
		top: 2px;
		left: 2px;
		font-size: 0.6rem;
		color: #333;
		pointer-events: none;
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
