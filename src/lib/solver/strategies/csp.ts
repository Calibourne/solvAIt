import type { SudokuGrid } from '../grid';
import type { SolvingStrategy, Step } from './types';

export class CSPStrategy implements SolvingStrategy {
	name = 'csp';

	*solve(grid: SudokuGrid): Generator<Step, boolean, void> {
		return yield* this.solveRecursive(grid);
	}

	private *solveRecursive(grid: SudokuGrid): Generator<Step, boolean, void> {
		const emptyCell = this.findBestCell(grid);
		if (!emptyCell) return true;

		const [r, c] = emptyCell;
		const domain = this.getOrderedDomain(grid, r, c);

		for (const val of domain) {
			if (grid.isValid(r, c, val)) {
				grid.setCell(r, c, val);
				yield { cell: [r, c], value: val, strategy: 'csp' };

				if (yield* this.solveRecursive(grid)) {
					return true;
				}

				grid.setCell(r, c, 0);
				yield { cell: [r, c], value: 0, strategy: 'csp' };
			}
		}

		return false;
	}

	private findBestCell(grid: SudokuGrid): [number, number] | null {
		let minOptions = 10;
		let bestCell: [number, number] | null = null;

		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (grid.getCell(r, c) === 0) {
					let options = 0;
					for (let v = 1; v <= 9; v++) {
						if (grid.isValid(r, c, v)) options++;
					}
					if (options < minOptions) {
						minOptions = options;
						bestCell = [r, c];
					}
				}
			}
		}
		return bestCell;
	}

	private getOrderedDomain(grid: SudokuGrid, r: number, c: number): number[] {
		const values = [];
		for (let v = 1; v <= 9; v++) {
			if (grid.isValid(r, c, v)) values.push(v);
		}
		return values;
	}
}
