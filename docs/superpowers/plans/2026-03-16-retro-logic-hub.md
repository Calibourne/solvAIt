# solvAIt Retro Logic Hub Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform solvAIt into a "Retro Logic Hub" where each game (Sudoku, Sokoban, GoL) has a distinct, era-inspired visual identity that "morphs" the UI skin based on the active route.

**Architecture:** A SvelteKit-based "Theme-Swap" system. A derived `themeStore` tracks the active route and applies a global theme class to the layout. Each theme defines a set of CSS variables that components consume.

**Tech Stack:** SvelteKit, TypeScript, Vanilla CSS (with CSS Variables).

---

## Chunk 1: Theme Architecture & CSS Foundation

### Task 1: Create the Theme Store
**Files:**
- Create: `src/lib/stores/theme.ts`

- [ ] **Step 1: Implement `themeStore`**
  ```typescript
  import { derived } from 'svelte/store';
  import { page } from '$app/stores';

  export type Theme = 'theme-pop' | 'theme-synth' | 'theme-matrix' | 'theme-hub';

  export const themeStore = derived(page, ($page) => {
    const path = $page.url.pathname;
    if (path.includes('/killer-sudoku')) return 'theme-pop';
    if (path.includes('/sokoban')) return 'theme-synth';
    if (path.includes('/gol')) return 'theme-matrix';
    return 'theme-hub';
  });
  ```
- [ ] **Step 2: Commit**
  `git add src/lib/stores/theme.ts && git commit -m "feat: add themeStore derived from route"`

### Task 2: Define Global CSS Themes
**Files:**
- Create: `src/lib/styles/themes.css`
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Create `src/lib/styles/themes.css` with all three themes**
  Define `:root` variables and theme classes (`.theme-pop`, `.theme-synth`, `.theme-matrix`) that map them to functional variables like `--color-bg`, `--color-primary`, `--border-weight`, etc.
  Include a **global transition** for background-color and color to ensure smooth "morphing" between themes.
- [ ] **Step 2: Import themes in `+layout.svelte`**
- [ ] **Step 3: Apply dynamic theme class to a full-viewport wrapper div**
  ```svelte
  <div class="app-wrapper {$themeStore}">
    <slot />
  </div>

  <style>
    .app-wrapper {
      min-height: 100vh;
      background-color: var(--color-bg);
      color: var(--color-text);
      transition: background-color 0.4s ease, color 0.4s ease;
    }
  </style>
  ```
- [ ] **Step 4: Commit**
  `git add src/lib/styles/themes.css src/routes/+layout.svelte && git commit -m "style: implement theme-swap architecture in layout with global transition"`

---

## Chunk 2: Killer Sudoku "Playful Pop" Styling

### Task 3: Update Grid to consume CSS Variables
**Files:**
- Modify: `src/lib/components/Grid.svelte`

- [ ] **Step 1: Refactor Grid.svelte <style> to use variables**
  Use `var(--color-primary)`, `var(--border-weight)`, etc. for the table, cells, and inputs.
- [ ] **Step 2: Refactor `getCellCageColor` to use CSS Variables**
  Instead of hardcoded RGBA strings in JS, define `--color-cage-1`, `--color-cage-2`, etc. in `themes.css` and use them in the `style` attribute.
- [ ] **Step 3: Update Cage Styling Traits**
  Apply the "Bloody Red" theme for Sudoku's cages using CSS variables.
- [ ] **Step 4: Commit**
  `git add src/lib/components/Grid.svelte && git commit -m "style: update Sudoku grid to respect Playful Pop theme with CSS variables for cages"`

### Task 4: Update ControlPanel to consume CSS Variables
**Files:**
- Modify: `src/lib/components/ControlPanel.svelte`

- [ ] **Step 1: Refactor ControlPanel.svelte <style> to use variables**
  Update buttons, inputs, and containers to use the theme variables.
- [ ] **Step 2: Commit**
  `git add src/lib/components/ControlPanel.svelte && git commit -m "style: update Sudoku control panel for Playful Pop"`

---

## Chunk 3: Retro Hub & Navigation

### Task 5: Create Sidebar Navigation
**Files:**
- Create: `src/lib/components/Navigation.svelte`
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Implement Navigation.svelte**
  A sidebar with three icons (Sudoku, Sokoban, GoL) that link to their respective routes.
- [ ] **Step 2: Integrate Navigation into Layout**
- [ ] **Step 3: Commit**
  `git add src/lib/components/Navigation.svelte src/routes/+layout.svelte && git commit -m "feat: add theme-aware sidebar navigation"`

### Task 6: Implement Retro Game Launcher (Home Page)
**Files:**
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Design the Game Launcher**
  A high-impact "Select Game" screen using the retro theme.
- [ ] **Step 2: Commit**
  `git add src/routes/+page.svelte && git commit -m "feat: implement retro game launcher home page"`
