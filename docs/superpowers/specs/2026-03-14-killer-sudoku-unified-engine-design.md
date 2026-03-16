# Design Spec: solvAIt SvelteKit Unified Engine

**Date:** 2026-03-14  
**Topic:** Unified Solver Engine (SvelteKit + Web Workers)  
**Status:** Revised for Static Hosting (GitHub Pages)

---

## 1. Objective
Implement a high-performance, statically hostable puzzle-solving platform using **SvelteKit**. The solver engine will be ported to **JavaScript/TypeScript** and run in a **Web Worker** to ensure the UI remains responsive during complex calculations.

## 2. Architecture: Reactive Strategy Pattern
The application will leverage Svelte's reactivity for the UI and a modular Strategy Pattern for the solving logic.

### 2.1 Core Components (SvelteKit)
- **`lib/solver/engine.js`**: Orchestrates the solving process.
- **`lib/solver/strategies/`**: Individual algorithm modules (Backtracking, CSP, Heuristics).
- **`lib/solver/worker.js`**: The Web Worker entry point.
- **`routes/killer-sudoku/`**: The main interface for the puzzle.
- **`lib/stores/grid.js`**: Svelte store to manage the 9x9 grid, cages, and current state.

### 2.2 Solving Modes (Web Worker)
- **Tiered (Default)**: Heuristics -> CSP -> Backtracking.
- **Manual**: Specific algorithm selection.
- **Visualize**: The worker sends messages back to the main thread for every step, which the Svelte store then reflects in the UI.

## 3. Data Structures & Messages

### 3.1 Main Thread -> Worker (Request)
```javascript
{
  type: 'SOLVE',
  payload: {
    grid: number[][],
    cages: { sum: number, cells: [number, number][] }[],
    mode: 'tiered' | 'backtracking' | 'csp' | 'heuristics',
    visualize: boolean
  }
}
```

### 3.2 Worker -> Main Thread (Response/Update)
```javascript
// Final Solution
{
  type: 'DONE',
  payload: {
    status: 'solved' | 'impossible',
    solution: number[][],
    stats: { timeMs: number, iterations: number }
  }
}

// Step Update (only if visualize: true)
{
  type: 'STEP',
  payload: {
    cell: [number, number],
    value: number,
    strategy: 'heuristic' | 'csp' | 'backtracking'
  }
}
```

## 4. UI/UX Design (Svelte Components)

### 4.1 Layout
- **`Grid.svelte`**: Interactive 9x9 Sudoku grid.
- **`ControlPanel.svelte`**: Sidebar for mode selection, stats, and actions.
- **`CageEditor.svelte`**: Logic for defining and summing cages.

### 4.2 Reactivity
- **Stores**: Use a Svelte store to keep the grid state in sync with worker updates.
- **Animations**: CSS transitions for cell value updates during visualization.

## 5. Deployment
- **Adapter**: `@sveltejs/adapter-static` for GitHub Pages compatibility.
- **Base Path**: Configured for `github.io/solvAIt` subfolder.

---

## 6. Updated Implementation Plan (Next Steps)
1. **Phase 1**: Scaffold SvelteKit project and setup `@sveltejs/adapter-static`.
2. **Phase 2**: Port `SudokuGrid` and `BacktrackingStrategy` to JS.
3. **Phase 3**: Implement Web Worker communication and Svelte stores.
4. **Phase 4**: Build the interactive UI and Visualizer.
