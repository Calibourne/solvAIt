import { writable, derived } from 'svelte/store';
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
    showSumModal: boolean;
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
	lastStep: null,
    showSumModal: false
});

function createGridStore() {
	const { subscribe, set, update } = writable<GridState>(createInitialState());

	return {
		subscribe,
		setCell: (r: number, c: number, val: number) =>
			update((s) => {
				s.grid[r][c] = val;
				s.metadata[r][c] = { isUserInput: val !== 0, strategy: null };
				return { ...s };
			}),
		toggleEditMode: () => update((s) => ({ ...s, isEditMode: !s.isEditMode, isNewCageMode: false, selectedCells: [], showSumModal: false })),
		toggleNewCageMode: () => update((s) => {
            const nextMode = !s.isNewCageMode;
            return {
                ...s,
                isNewCageMode: nextMode,
                selectedCells: nextMode ? s.selectedCells : [],
                showSumModal: false
            };
        }),
		selectCell: (r: number, c: number) =>
			update((s) => {
				const isSelected = s.selectedCells.some((cell) => cell[0] === r && cell[1] === c);
				const nextSelected = isSelected
					? s.selectedCells.filter((cell) => cell[0] !== r || cell[1] !== c)
					: [...s.selectedCells, [r, c]];
				return { ...s, selectedCells: nextSelected };
			}),
		addCage: (sum: number) =>
			update((s) => ({
				...s,
				cages: [...s.cages, { sum, cells: s.selectedCells }],
				selectedCells: [],
				isNewCageMode: false,
                showSumModal: false
			})),
        removeCage: (index: number) => update(s => {
            const nextCages = [...s.cages];
            nextCages.splice(index, 1);
            return { ...s, cages: nextCages };
        }),
		reset: () => set(createInitialState()),
        resetSolution: () => update(s => {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (!s.metadata[r][c].isUserInput) {
                        s.grid[r][c] = 0;
                        s.metadata[r][c].strategy = null;
                    }
                }
            }
            return { ...s, stats: null, lastStep: null, isSolving: false };
        }),
        resetGrid: () => update(s => {
            s.grid = createInitialGrid();
            s.metadata = createInitialMetadata();
            return { ...s, stats: null, lastStep: null, isSolving: false };
        }),
        resetCages: () => update(s => ({ ...s, cages: [] })),
		setSolving: (isSolving: boolean) => update((s) => ({ ...s, isSolving })),
		applyStep: (step: Step) =>
			update((s) => {
				s.grid[step.cell[0]][step.cell[1]] = step.value;
				s.metadata[step.cell[0]][step.cell[1]] = { 
					isUserInput: false, 
					strategy: step.value === 0 ? null : step.strategy 
				};
				s.lastStep = step;
				return { ...s };
			}),
		setStats: (stats: { timeMs: number; iterations: number }) => update((s) => ({ ...s, stats })),
		setSolution: (solution: number[][]) =>
			update((s) => {
                const nextMetadata = s.metadata.map(row => row.map(cell => ({...cell})));
				for (let r = 0; r < 9; r++) {
					for (let c = 0; c < 9; c++) {
						if (s.grid[r][c] === 0 && solution[r][c] !== 0) {
							nextMetadata[r][c] = { isUserInput: false, strategy: null };
						}
					}
				}
				return {
                    ...s,
                    grid: solution.map((row) => [...row]),
                    metadata: nextMetadata,
                    isSolving: false
                };
			}),
        setShowSumModal: (show: boolean) => update(s => ({ ...s, showSumModal: show }))
	};
}

export const gridStore = createGridStore();

// Derived store to find conflicts
export const conflicts = derived(gridStore, ($gridStore) => {
    const conflictCells = new Set<string>();
    const grid = $gridStore.grid;

    // Row conflicts
    for (let r = 0; r < 9; r++) {
        const seen = new Map<number, number>();
        for (let c = 0; c < 9; c++) {
            const val = grid[r][c];
            if (val !== 0) {
                if (seen.has(val)) {
                    conflictCells.add(`${r},${c}`);
                    conflictCells.add(`${r},${seen.get(val)!}`);
                }
                seen.set(val, c);
            }
        }
    }

    // Column conflicts
    for (let c = 0; c < 9; c++) {
        const seen = new Map<number, number>();
        for (let r = 0; r < 9; r++) {
            const val = grid[r][c];
            if (val !== 0) {
                if (seen.has(val)) {
                    conflictCells.add(`${r},${c}`);
                    conflictCells.add(`${seen.get(val)!},${c}`);
                }
                seen.set(val, r);
            }
        }
    }

    // Box conflicts
    for (let b = 0; b < 9; b++) {
        const seen = new Map<number, [number, number]>();
        const startR = Math.floor(b / 3) * 3;
        const startC = (b % 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const r = startR + i;
                const c = startC + j;
                const val = grid[r][c];
                if (val !== 0) {
                    if (seen.has(val)) {
                        conflictCells.add(`${r},${c}`);
                        const [sr, sc] = seen.get(val)!;
                        conflictCells.add(`${sr},${sc}`);
                    }
                    seen.set(val, [r, c]);
                }
            }
        }
    }

    // Cage conflicts (duplicate numbers in cage)
    for (const cage of $gridStore.cages) {
        const seen = new Map<number, [number, number]>();
        for (const [r, c] of cage.cells) {
            const val = grid[r][c];
            if (val !== 0) {
                if (seen.has(val)) {
                    conflictCells.add(`${r},${c}`);
                    const [sr, sc] = seen.get(val)!;
                    conflictCells.add(`${sr},${sc}`);
                }
                seen.set(val, [r, c]);
            }
        }
    }

    return conflictCells;
});
