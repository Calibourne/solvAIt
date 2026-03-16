<script lang="ts">
	import { themeStore } from '$lib/stores/theme';
	import { page } from '$app/stores';

	const games = [
		{ id: 'hub', path: '/', label: 'HUB', theme: 'theme-hub' },
		{ id: 'sudoku', path: '/killer-sudoku', label: 'SDK', theme: 'theme-pop' },
		{ id: 'sokoban', path: '/sokoban', label: 'SKB', theme: 'theme-synth' },
		{ id: 'gol', path: '/gol', label: 'GOL', theme: 'theme-matrix' }
	];

	function isActive(path: string) {
		if (path === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(path);
	}
</script>

<nav class="sidebar">
	<div class="logo">solvAIt</div>
	<div class="nav-items">
		{#each games as game}
			<a
				href={game.path}
				class="nav-item {game.theme}"
				class:active={isActive(game.path)}
				title={game.label}
			>
				{game.label}
			</a>
		{/each}
	</div>
</nav>

<style>
	.sidebar {
		width: 70px;
		height: 100vh;
		background: #111;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 0;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		border-right: 1px solid #333;
	}
	.logo {
		font-weight: 900;
		font-size: 0.7rem;
		color: #fff;
		margin-bottom: 40px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.nav-items {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.nav-item {
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-size: 0.75rem;
		font-weight: 900;
		border-radius: 8px;
		transition: all 0.2s;
		border: 2px solid transparent;
	}

	/* Theme Specific Nav Icons */
	.theme-hub {
		background: #333;
		color: #fff;
	}
	.theme-pop {
		background: #ffde59;
		color: #000;
		border-color: #b30000;
	}
	.theme-synth {
		background: #050510;
		color: #00ffff;
		border-color: #00ffff;
	}
	.theme-matrix {
		background: #000;
		color: #00ff00;
		border-color: #00ff00;
	}

	.nav-item:hover {
		transform: scale(1.1);
	}
	.nav-item.active {
		box-shadow: 0 0 15px currentColor;
		transform: scale(1.1);
	}
</style>
