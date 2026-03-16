# Specification: solvAIt Retro Logic Hub

**Date:** 2026-03-16
**Status:** Draft
**Topic:** Visual Identity and Theme-Swap Architecture

## 1. Executive Summary
**solvAIt** is evolving from a generic dashboard aesthetic into a "Retro Logic Hub." Each of the three core puzzles will have a distinct, era-inspired visual identity. The application will use a "Theme-Swap" architecture where the global UI (navigation, containers, controls) morphs its visual skin (colors, borders, typography) to match the selected game.

## 2. Visual Identities

### 2.1 Killer Sudoku: Playful Pop
Inspired by high-end physical puzzle toys and early 2000s handheld consoles.
*   **Palette:**
    *   Primary Background: `#FFDE59` (Vibrant Yellow)
    *   Accent / Cages: `#B30000` (Bloody Red)
    *   Surface / Cells: `#FFFFFF` (Pure White)
    *   Ink / Borders: `#000000` (Pure Black)
*   **Traits:**
    *   Borders: Thick (3px+) solid black.
    *   Corners: Rounded (12px radius).
    *   Typography: Bold sans-serif (Inter/Geist).
    *   Shadows: Hard, offset "sticker" shadows (`4px 4px 0px rgba(0,0,0,0.1)`).

### 2.2 Sokoban: Synthwave
Inspired by 80s arcade aesthetics and futuristic cyber-industrial environments.
*   **Palette:**
    *   Deep Void BG: `#050510` (Near-Black Navy)
    *   Walls: `#00FFFF` (Neon Cyan)
    *   Crates (Boxes): `#FF00FF` (Neon Pink)
    *   Grid Lines: `#1A1A3A` (Dim Navy)
    *   Active/Player/Goal: `#FFFFFF` (White Glow)
*   **Traits:**
    *   Borders: Thin (1px) with neon glow (`box-shadow: 0 0 10px`).
    *   Corners: Sharp (0px radius).
    *   Typography: High-tech sans-serif or pixel fonts.
    *   Overlays: Subtle scanline or CRT flickering effects.

### 2.3 Reverse Game of Life: Terminal Matrix
Inspired by 90s hacker terminals and classic cellular automata simulations.
*   **Palette:**
    *   Terminal BG: `#000000` (Pure Black)
    *   Alive Cells: `#00FF00` (Matrix Green)
    *   Grid / Dead Cells: `#003300` (Dim Green)
    *   High Alert: `#FFFFFF` (White)
*   **Traits:**
    *   Borders: 1px solid dim green.
    *   Corners: Sharp (0px radius).
    *   Typography: Strictly monospaced (JetBrains Mono / Courier).
    *   Atmosphere: Glowing pixel cells with a "digital rain" background animation.

## 3. Architecture: The Theme-Swap Hub

### 3.1 Global Navigation
*   A consistent sidebar or top-bar that allows switching between games.
*   Navigation icons will represent their respective theme's primary color/style.
*   The hub state will be managed in a Svelte store (`themeStore`), which tracks the current `activeTheme`.

### 3.2 CSS Variable System
The application will use a unified set of CSS variables that each component respects. These variables will be updated at the root level whenever the theme changes.
*   `--color-bg`: Main background color.
*   `--color-primary`: Main accent color.
*   `--color-surface`: Card/Cell background.
*   `--border-weight`: Global border thickness.
*   `--border-radius`: Global corner roundness.
*   `--font-main`: Primary typeface.

### 3.3 State-Driven Skinning
*   The `+layout.svelte` will apply a theme class (e.g., `theme-pop`, `theme-synth`, `theme-matrix`) to the main container based on the current route.
*   Svelte's `crossfade` or simple `transition` directives will be used to animate the "morph" between themes, creating a satisfying "boot-up" feel when switching games.

## 4. Implementation Goals
*   **Phase 1:** Update `Killer Sudoku` with the "Playful Pop" style.
*   **Phase 2:** Implement the `themeStore` and global navigation hub.
*   **Phase 3:** Create placeholder components for `Sokoban` and `Reverse GoL` to demonstrate the theme-swapping.
*   **Phase 4:** Polish with animations and era-appropriate UI sounds (optional/future).
