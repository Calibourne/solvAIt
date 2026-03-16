export type Cell = [number, number];

export interface Cage {
	sum: number;
	cells: Cell[];
}

export interface Step {
	cell: Cell;
	value: number;
	strategy: 'heuristic' | 'csp' | 'backtracking';
}

export interface SolvingStrategy {
	name: string;
	solve(grid: SudokuGrid): Generator<Step, boolean, void>;
}

import type { SudokuGrid } from '../grid';
