import { SudokuGrid } from './grid';
import { SolverEngine } from './engine';

const engine = new SolverEngine();

self.onmessage = (e) => {
	const { grid, cages, mode, visualize } = e.data;
	const sudokuGrid = new SudokuGrid(grid, cages);
	const start = performance.now();
	let iterations = 0;

	const solver = engine.solve(sudokuGrid, mode);

	while (true) {
		const { value, done } = solver.next();
		iterations++;

		if (done) {
			const end = performance.now();
			self.postMessage({
				type: 'DONE',
				payload: {
					status: value.status,
					solution: value.solution,
					stats: {
						timeMs: end - start,
						iterations
					}
				}
			});
			break;
		}

		if (visualize) {
			self.postMessage({ type: 'STEP', payload: value });
		}
	}
};
