<script lang="ts">
	const games = [
		{
			id: 'sudoku',
			title: 'MURDER_MYSTERY',
			path: '/killer-sudoku',
			theme: 'theme-pop',
			desc: 'Logic + Arithmetic. Noir crime scene investigation.'
		},
		{
			id: 'sokoban',
			title: 'TRON_PROTOCOL',
			path: '/sokoban',
			theme: 'theme-synth',
			desc: 'Spatial pushing. Neon grid light cycle trails.'
		},
		{
			id: 'gol',
			title: 'GHOST_IN_THE_SHELL',
			path: '/gol',
			theme: 'theme-matrix',
			desc: 'Cellular evolution. Neural hacking terminal.'
		}
	];
</script>

<div class="hub-container">
	<header>
		<h1>solvAIt</h1>
		<p class="subtitle">CINEMATIC LOGIC HUB // SELECT_REALITY</p>
	</header>

	<div class="game-grid">
		{#each games as game}
			<a href={game.path} class="game-card {game.theme}">
				<div class="card-content">
					<h2>{game.title}</h2>
					<p>{game.desc}</p>
					<div class="action-label">INITIALIZE_SEQUENCE_</div>
				</div>
			</a>
		{/each}
	</div>

	<footer>
		<div class="system-status">
			<span class="pulse"></span> REALITY_STABLE // ALL_MODULES_SYNCED
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 30px;
		width: 100%;
		max-width: 1100px;
	}

	.game-card {
		text-decoration: none;
		border: 3px solid #000;
		border-radius: 12px;
		height: 220px;
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
		background: #e5e5e1;
		color: #2c2c2c;
		border-color: #000;
		box-shadow: 8px 8px 0 #b30000;
		font-family: 'Courier Prime', 'Courier New', monospace;
	}
	.theme-synth {
		background: #020410;
		color: #00d2ff;
		border-color: #00d2ff;
		box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
		font-family: 'Orbitron', sans-serif;
	}
	.theme-matrix {
		background: #000;
		color: #00ff41;
		border-color: #00ff41;
		font-family: 'JetBrains Mono', monospace;
		box-shadow: inset 0 0 20px rgba(0, 255, 65, 0.1);
	}

	.card-content h2 {
		font-size: 1.6rem;
		margin: 0 0 12px 0;
		font-weight: 900;
	}
	.card-content p {
		font-size: 0.9rem;
		opacity: 0.9;
		margin: 0;
		font-weight: bold;
		line-height: 1.4;
	}
	.action-label {
		margin-top: auto;
		font-family: monospace;
		font-weight: 900;
		font-size: 0.75rem;
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
		background: #00ff41;
		border-radius: 50%;
		display: inline-block;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 6px rgba(0, 255, 65, 0);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(0, 255, 65, 0);
		}
	}
</style>
