import type { SudokuGrid } from '../grid';
import type { SolvingStrategy, Step } from './types';

export class BacktrackingStrategy implements SolvingStrategy {
	name = 'backtracking';

	*solve(grid: SudokuGrid): Generator<Step, boolean, void> {
		return yield* this.solveRecursive(grid, 0, 0);
	}

	private *solveRecursive(grid: SudokuGrid, r: number, c: number): Generator<Step, boolean, void> {
		if (r === 9) return true;

		const nextR = c === 8 ? r + 1 : r;
		const nextC = c === 8 ? 0 : c + 1;

		if (grid.getCell(r, c) !== 0) {
			return yield* this.solveRecursive(grid, nextR, nextC);
		}

		for (let val = 1; val <= 9; val++) {
			if (grid.isValid(r, c, val)) {
				grid.setCell(r, c, val);
				yield { cell: [r, c], value: val, strategy: 'backtracking' };

				if (yield* this.solveRecursive(grid, nextR, nextC)) {
					return true;
				}

				grid.setCell(r, c, 0);
				yield { cell: [r, c], value: 0, strategy: 'backtracking' };
			}
		}

		return false;
	}
}
