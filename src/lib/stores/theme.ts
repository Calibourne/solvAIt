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
