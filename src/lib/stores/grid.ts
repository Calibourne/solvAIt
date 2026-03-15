import { writable } from 'svelte/store';
import type { Cage, Cell, Step } from '../solver/strategies/types';

export interface CellMetadata {
	isUserInput: boolean;
	strategy: 'heuristic' | 'csp' | 'backtracking' | null;
}

interface GridState {
	grid: number[][];
	metadata: CellMetadata[][];
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

const createInitialGrid = () => Array(9).fill(0).map(() => Array(9).fill(0));
const createInitialMetadata = (): CellMetadata[][] => 
	Array(9).fill(null).map(() => 
		Array(9).fill(null).map(() => ({ isUserInput: false, strategy: null }))
	);

const createInitialState = (): GridState => ({
	grid: createInitialGrid(),
	metadata: createInitialMetadata(),
	cages: [],
	isEditMode: false,
	isNewCageMode: false,
	selectedCells: [],
	isSolving: false,
	solveMode: 'tiered',
	visualize: true,
	stats: null,
	lastStep: null
});

function createGridStore() {
	const { subscribe, set, update } = writable<GridState>(createInitialState());

	return {
		subscribe,
		setCell: (r: number, c: number, val: number) =>
			update((s) => {
				s.grid[r][c] = val;
				s.metadata[r][c] = { isUserInput: val !== 0, strategy: null };
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
		reset: () => set(createInitialState()),
		setSolving: (isSolving: boolean) => update((s) => ({ ...s, isSolving })),
		applyStep: (step: Step) =>
			update((s) => {
				s.grid[step.cell[0]][step.cell[1]] = step.value;
				s.metadata[step.cell[0]][step.cell[1]] = { 
					isUserInput: false, 
					strategy: step.value === 0 ? null : step.strategy 
				};
				s.lastStep = step;
				return s;
			}),
		setStats: (stats: { timeMs: number; iterations: number }) => update((s) => ({ ...s, stats })),
		setSolution: (solution: number[][]) =>
			update((s) => {
				for (let r = 0; r < 9; r++) {
					for (let c = 0; c < 9; c++) {
						if (s.grid[r][c] === 0 && solution[r][c] !== 0) {
							s.metadata[r][c] = { isUserInput: false, strategy: null };
						}
					}
				}
				s.grid = solution.map((row) => [...row]);
				s.isSolving = false;
				return s;
			})
	};
}

export const gridStore = createGridStore();
