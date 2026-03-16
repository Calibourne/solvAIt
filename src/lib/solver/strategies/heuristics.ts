import type { SudokuGrid } from '../grid';
import type { SolvingStrategy, Step } from './types';

export class HeuristicStrategy implements SolvingStrategy {
	name = 'heuristic';

	*solve(grid: SudokuGrid): Generator<Step, boolean, void> {
		let changed = true;
		while (changed) {
			changed = false;

			// Full House Check
			for (let r = 0; r < 9; r++) {
				for (let c = 0; c < 9; c++) {
					if (grid.getCell(r, c) === 0) {
						let options = [];
						for (let v = 1; v <= 9; v++) {
							if (grid.isValid(r, c, v)) options.push(v);
						}
						if (options.length === 1) {
							const val = options[0];
							grid.setCell(r, c, val);
							yield { cell: [r, c], value: val, strategy: 'heuristic' };
							changed = true;
						}
					}
				}
			}
		}

		// Check if fully solved
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (grid.getCell(r, c) === 0) return false;
			}
		}

		return true;
	}
}
