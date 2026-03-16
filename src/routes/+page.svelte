<script lang="ts">
	const games = [
		{
			id: 'sudoku',
			title: 'Killer Sudoku',
			path: '/killer-sudoku',
			theme: 'theme-pop',
			desc: 'Logic + Arithmetic. Vibrant and tactile.'
		},
		{
			id: 'sokoban',
			title: 'Sokoban',
			path: '/sokoban',
			theme: 'theme-synth',
			desc: 'Spatial pushing. Neon cyber-industrial.'
		},
		{
			id: 'gol',
			title: 'Reverse GoL',
			path: '/gol',
			theme: 'theme-matrix',
			desc: 'Cellular evolution. Terminal mainframe.'
		}
	];
</script>

<div class="hub-container">
	<header>
		<h1>solvAIt</h1>
		<p class="subtitle">RETRO LOGIC HUB // SELECT_MODULE</p>
	</header>

	<div class="game-grid">
		{#each games as game}
			<a href={game.path} class="game-card {game.theme}">
				<div class="card-content">
					<h2>{game.title}</h2>
					<p>{game.desc}</p>
					<div class="action-label">INITIALIZE_</div>
				</div>
			</a>
		{/each}
	</div>

	<footer>
		<div class="system-status">
			<span class="pulse"></span> SYSTEM_READY // ALL_MODULES_LOADED
		</div>
	</footer>
</div>

<style>
	.hub-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 40px;
		box-sizing: border-box;
	}
	header {
		text-align: center;
		margin-bottom: 60px;
	}
	h1 {
		font-size: 5rem;
		margin: 0;
		font-weight: 900;
		letter-spacing: -0.05em;
		text-transform: uppercase;
		line-height: 0.9;
	}
	.subtitle {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1rem;
		opacity: 0.6;
		margin-top: 10px;
		letter-spacing: 0.2em;
	}

	.game-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 30px;
		width: 100%;
		max-width: 1000px;
	}

	.game-card {
		text-decoration: none;
		border: 3px solid #000;
		border-radius: 12px;
		height: 200px;
		display: flex;
		flex-direction: column;
		padding: 24px;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
		overflow: hidden;
	}

	.game-card:hover {
		transform: translateY(-10px) scale(1.02);
	}

	/* Theme Mappings for Cards */
	.theme-pop {
		background: #ffde59;
		color: #000;
		box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.1);
	}
	.theme-synth {
		background: #050510;
		color: #00ffff;
		border-color: #00ffff;
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
	}
	.theme-matrix {
		background: #000;
		color: #00ff00;
		border-color: #00ff00;
		font-family: 'JetBrains Mono', monospace;
	}

	.card-content h2 {
		font-size: 1.8rem;
		margin: 0 0 10px 0;
		font-weight: 900;
	}
	.card-content p {
		font-size: 0.95rem;
		opacity: 0.8;
		margin: 0;
		font-weight: bold;
	}
	.action-label {
		margin-top: auto;
		font-family: monospace;
		font-weight: 900;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		padding-top: 20px;
	}

	footer {
		margin-top: 80px;
	}
	.system-status {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		gap: 10px;
		opacity: 0.5;
	}
	.pulse {
		width: 8px;
		height: 8px;
		background: #00ff00;
		border-radius: 50%;
		display: inline-block;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 6px rgba(0, 255, 0, 0);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
		}
	}
</style>
