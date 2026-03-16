<script lang="ts">
	import { themeStore } from '$lib/stores/theme';
	import { page } from '$app/stores';

	const games = [
		{ id: 'hub', path: '/', label: 'REAL', theme: 'theme-hub', title: 'Reality Select' },
		{ id: 'sudoku', path: '/killer-sudoku', label: 'NOIR', theme: 'theme-pop', title: 'Murder Mystery' },
		{ id: 'sokoban', path: '/sokoban', label: 'TRON', theme: 'theme-synth', title: 'Tron Protocol' },
		{ id: 'gol', path: '/gol', label: 'SHELL', theme: 'theme-matrix', title: 'Ghost in the Shell' }
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
				title={game.title}
			>
				{game.label}
			</a>
		{/each}
	</div>
	<div class="version">V2.6.3</div>
</nav>

<style>
	.sidebar {
		width: 70px;
		height: 100vh;
		background: #000;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px 0;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		border-right: 1px solid #222;
	}
	.logo {
		font-weight: 900;
		font-size: 0.65rem;
		color: #fff;
		margin-bottom: 50px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		opacity: 0.5;
	}
	.nav-items {
		display: flex;
		flex-direction: column;
		gap: 25px;
	}
	.nav-item {
		width: 46px;
		height: 46px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-size: 0.65rem;
		font-weight: 900;
		border-radius: 4px;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		border: 2px solid transparent;
		letter-spacing: 0.05em;
	}

	/* Theme Specific Nav Icons */
	.theme-hub {
		background: #1a1a1a;
		color: #888;
		border-color: #333;
	}
	.theme-pop {
		background: #e5e5e1;
		color: #2c2c2c;
		border-color: #000;
		font-family: 'Courier Prime', 'Courier New', monospace;
	}
	.theme-synth {
		background: #020410;
		color: #00d2ff;
		border-color: #00d2ff;
		font-family: 'Orbitron', sans-serif;
	}
	.theme-matrix {
		background: #000;
		color: #00ff41;
		border-color: #00ff41;
		font-family: 'JetBrains Mono', monospace;
	}

	.nav-item:hover {
		transform: scale(1.15) rotate(2deg);
	}
	
	.nav-item.active {
		transform: scale(1.1);
		z-index: 2;
	}

	.theme-pop.active {
		box-shadow: 4px 4px 0 #b30000;
		border-width: 3px;
	}
	.theme-synth.active {
		box-shadow: 0 0 15px rgba(0, 210, 255, 0.6);
		background: rgba(0, 210, 255, 0.1);
	}
	.theme-matrix.active {
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
		text-shadow: 0 0 5px var(--color-primary);
	}
	.theme-hub.active {
		background: #fff;
		color: #000;
		border-color: #fff;
	}

	.version {
		margin-top: auto;
		font-size: 0.5rem;
		font-family: monospace;
		opacity: 0.3;
		letter-spacing: 0.1em;
	}
</style>
