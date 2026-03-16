import type { SudokuGrid } from './grid';
import { BacktrackingStrategy } from './strategies/backtracking';
import { CSPStrategy } from './strategies/csp';
import { HeuristicStrategy } from './strategies/heuristics';
import type { Step } from './strategies/types';

export class SolverEngine {
	private strategies = {
		backtracking: new BacktrackingStrategy(),
		csp: new CSPStrategy(),
		heuristic: new HeuristicStrategy()
	};

	*solve(
		grid: SudokuGrid,
		mode: 'tiered' | 'backtracking' | 'csp' | 'heuristic'
	): Generator<Step, { status: string; solution: number[][] | null }, void> {
		if (mode === 'tiered') {
			// First try heuristics
			const heuristicRes = yield* this.strategies.heuristic.solve(grid);
			if (heuristicRes) return { status: 'solved', solution: grid.getRawGrid() };

			// Then CSP
			const cspRes = yield* this.strategies.csp.solve(grid);
			if (cspRes) return { status: 'solved', solution: grid.getRawGrid() };

			// Finally full backtracking (already covered by CSP mostly, but for completeness)
			const backRes = yield* this.strategies.backtracking.solve(grid);
			if (backRes) return { status: 'solved', solution: grid.getRawGrid() };
		} else {
			const res = yield* this.strategies[mode].solve(grid);
			if (res) return { status: 'solved', solution: grid.getRawGrid() };
		}

		return { status: 'impossible', solution: null };
	}
}
