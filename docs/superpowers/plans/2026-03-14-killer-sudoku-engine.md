# solvAIt SvelteKit Killer Sudoku Engine Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a statically hostable, modular, multi-strategy Killer Sudoku solver using SvelteKit and Web Workers.

**Architecture:** A SvelteKit application where the `SolverEngine` and individual strategies (Backtracking, CSP, Heuristics) are implemented in JavaScript and executed within a **Web Worker** to keep the UI responsive.

**Tech Stack:** SvelteKit, TypeScript, Vite (for bundling/worker support), `@sveltejs/adapter-static`.

---

## Chunk 1: Preparation and Scaffolding

### Task 1: Cleanup and Project Initialization

**Files:**
- Delete: `app/`, `requirements.txt`
- Create: `package.json`, `svelte.config.js` (via initialization)
- Create: `static/.nojekyll` (for GitHub Pages)
- Modify: `svelte.config.js` to use `@sveltejs/adapter-static`

- [ ] **Step 1: Delete old Python-based backend files to clear directory for SvelteKit**
Run: `rm -rf app requirements.txt`
- [ ] **Step 2: Initialize SvelteKit project in the current directory**
Run: `npm create svelte@latest .` (Choose Skeleton project, TypeScript, No ESLint/Prettier/Playwright/Vitest - we will add manually if needed)
- [ ] **Step 3: Install dependencies**
Run: `npm install && npm install -D @sveltejs/adapter-static`
- [ ] **Step 4: Configure `adapter-static` in `svelte.config.js`**
```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html' }),
        paths: { base: process.env.NODE_ENV === 'production' ? '/solvAIt' : '' }
    }
};
export default config;
```
- [ ] **Step 5: Create `src/routes/+layout.js` for static hosting**
```javascript
export const prerender = true;
export const trailingSlash = 'always';
```
- [ ] **Step 6: Create `.nojekyll` in `static/`**
- [ ] **Step 7: Commit**
`git add . && git commit -m "chore: cleanup old backend and scaffold sveltekit project"`

---

## Chunk 2: Core Solver Logic (JS Port)

### Task 2: Implement `SudokuGrid` and `SolvingStrategy` interface

**Files:**
- Create: `src/lib/solver/grid.ts`
- Create: `src/lib/solver/strategies/types.ts`

- [ ] **Step 1: Implement `SudokuGrid` class with cell/cage management**
- [ ] **Step 2: Define `SolvingStrategy` interface and `Step` type**
- [ ] **Step 3: Commit**
`git add src/lib/solver && git commit -m "feat: implement grid and strategy types"`

### Task 3: Implement All Strategies (Backtracking, CSP, Heuristics)

**Files:**
- Create: `src/lib/solver/strategies/backtracking.ts`
- Create: `src/lib/solver/strategies/csp.ts`
- Create: `src/lib/solver/strategies/heuristics.ts`

- [ ] **Step 1: Implement `BacktrackingStrategy` (Recursive DFS)**
- [ ] **Step 2: Implement `CSPStrategy` (MRV + Forward Checking)**
- [ ] **Step 3: Implement `HeuristicStrategy` (Logic-based rules)**
- [ ] **Step 4: Commit**
`git commit -m "feat: implement backtracking, CSP, and heuristic strategies"`

---

## Chunk 3: Web Worker and Reactive State

### Task 4: Setup Web Worker Orchestration

**Files:**
- Create: `src/lib/solver/worker.ts`
- Create: `src/lib/stores/grid.ts`
- Create: `src/lib/solver/engine.ts`

- [ ] **Step 1: Implement `SolverEngine` to coordinate tiered execution**
- [ ] **Step 2: Implement `worker.ts` using the message schema (`SOLVE`, `DONE`, `STEP`)**
- [ ] **Step 3: Create Svelte Store `grid.ts` to manage UI state and worker lifecycle**
- [ ] **Step 4: Commit**
`git add src/lib/stores src/lib/solver && git commit -m "feat: implement web worker and grid store"`

---

## Chunk 4: UI/UX Implementation (Svelte Components)

### Task 5: Build Interactive Sudoku Grid and Control Panel

**Files:**
- Create: `src/lib/components/Grid.svelte`
- Create: `src/lib/components/ControlPanel.svelte`
- Modify: `src/routes/killer-sudoku/+page.svelte`

- [ ] **Step 1: Create `src/routes/killer-sudoku/` route**
- [ ] **Step 2: Build `Grid.svelte` with interactive cell editing and cage display**
- [ ] **Step 3: Build `ControlPanel.svelte` with mode selection and visualize toggle**
- [ ] **Step 4: Implement Step-by-Step Visualization playback in the store/component**
- [ ] **Step 5: Add CSS color-coding for different strategies**
- [ ] **Step 6: Commit**
`git add src/lib/components src/routes && git commit -m "feat: build interactive grid and control panel"`

---

## Chunk 5: Finalization and Build

### Task 6: Final Verification and Deployment Prep

**Files:**
- Modify: `package.json` (add deploy script)
- Modify: `src/routes/+page.svelte` (add link to killer-sudoku)

- [ ] **Step 1: Add a "Solve Killer Sudoku" link to the landing page**
- [ ] **Step 2: Run `npm run build` to verify static site generation**
- [ ] **Step 3: Test the final build locally using `npx serve build`**
- [ ] **Step 4: Final Commit**
`git commit -m "chore: final verification and static build"`
