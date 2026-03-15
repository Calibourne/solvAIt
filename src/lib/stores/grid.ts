import { writable } from 'svelte/store';
import type { Cage, Cell, Step } from '../solver/strategies/types';

interface GridState {
	grid: number[][];
	cages: Cage[];
	isEditMode: boolean;
	isNewCageMode: boolean;
	selectedCells: Cell[];
	isSolving: boolean;
	solveMode: 'tiered' | 'backtracking' | 'csp' | 'heuristic';
	visualize: boolean;
	stats: { timeMs: number; iterations: number } | null;
	lastStep: Step | null;
}

const initialGrid = Array(9)
	.fill(0)
	.map(() => Array(9).fill(0));

const initialState: GridState = {
	grid: initialGrid,
	cages: [],
	isEditMode: false,
	isNewCageMode: false,
	selectedCells: [],
	isSolving: false,
	solveMode: 'tiered',
	visualize: true,
	stats: null,
	lastStep: null
};

function createGridStore() {
	const { subscribe, set, update } = writable<GridState>(initialState);

	return {
		subscribe,
		setCell: (r: number, c: number, val: number) =>
			update((s) => {
				s.grid[r][c] = val;
				return s;
			}),
		toggleEditMode: () => update((s) => ({ ...s, isEditMode: !s.isEditMode })),
		toggleNewCageMode: () => update((s) => ({ ...s, isNewCageMode: !s.isNewCageMode })),
		selectCell: (r: number, c: number) =>
			update((s) => {
				const alreadySelected = s.selectedCells.find((cell) => cell[0] === r && cell[1] === c);
				if (alreadySelected) {
					s.selectedCells = s.selectedCells.filter((cell) => cell[0] !== r || cell[1] !== c);
				} else {
					s.selectedCells = [...s.selectedCells, [r, c]];
				}
				return s;
			}),
		addCage: (sum: number) =>
			update((s) => {
				s.cages.push({ sum, cells: s.selectedCells });
				s.selectedCells = [];
				s.isNewCageMode = false;
				return s;
			}),
		reset: () => set(initialState),
		setSolving: (isSolving: boolean) => update((s) => ({ ...s, isSolving })),
		applyStep: (step: Step) =>
			update((s) => {
				s.grid[step.cell[0]][step.cell[1]] = step.value;
				s.lastStep = step;
				return s;
			}),
		setStats: (stats: { timeMs: number; iterations: number }) => update((s) => ({ ...s, stats })),
		setSolution: (solution: number[][]) => update((s) => ({ ...s, grid: solution, isSolving: false }))
	};
}

export const gridStore = createGridStore();
