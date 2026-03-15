import type { Cage, Cell } from './strategies/types';

export class SudokuGrid {
	private grid: number[][];
	private cages: Cage[];
	private cageMap: Map<string, Cage>;

	constructor(grid: number[][], cages: Cage[]) {
		this.grid = grid.map((row) => [...row]);
		this.cages = cages;
		this.cageMap = new Map();
		for (const cage of cages) {
			for (const cell of cage.cells) {
				this.cageMap.set(`${cell[0]},${cell[1]}`, cage);
			}
		}
	}

	getCell(r: number, c: number): number {
		return this.grid[r][c];
	}

	setCell(r: number, c: number, val: number): void {
		this.grid[r][c] = val;
	}

	getCage(r: number, c: number): Cage | undefined {
		return this.cageMap.get(`${r},${c}`);
	}

	getRawGrid(): number[][] {
		return this.grid.map((row) => [...row]);
	}

	isValid(r: number, c: number, val: number): boolean {
		// Row and Column check
		for (let i = 0; i < 9; i++) {
			if (this.grid[r][i] === val || this.grid[i][c] === val) return false;
		}

		// 3x3 Box check
		const startRow = Math.floor(r / 3) * 3;
		const startCol = Math.floor(c / 3) * 3;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.grid[startRow + i][startCol + j] === val) return false;
			}
		}

		// Cage check
		const cage = this.getCage(r, c);
		if (cage) {
			let currentSum = val;
			let filledCells = 1;
			const valuesInCage = new Set<number>([val]);

			for (const cell of cage.cells) {
				if (cell[0] === r && cell[1] === c) continue;
				const cellVal = this.getCell(cell[0], cell[1]);
				if (cellVal !== 0) {
					if (valuesInCage.has(cellVal)) return false; // Unique values in cage
					currentSum += cellVal;
					filledCells++;
					valuesInCage.add(cellVal);
				}
			}

			if (currentSum > cage.sum) return false;
			if (filledCells === cage.cells.length && currentSum !== cage.sum) return false;
		}

		return true;
	}
}
