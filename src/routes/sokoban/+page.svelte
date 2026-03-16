<script lang="ts">
	// Placeholder for Sokoban logic
	const grid = Array(10).fill(0).map(() => Array(10).fill('empty'));
	grid[2][2] = 'player';
	grid[3][3] = 'crate';
	grid[3][4] = 'target';
</script>

<div class="game-container">
	<header>
		<div class="tron-title-container">
			<h1 class="tron-title">GRID_PROGRAM_v02</h1>
			<div class="glow-bar"></div>
		</div>
		<p class="status-line">USER_RECOGNIZED // SECTOR_07_ACCESS_GRANTED</p>
	</header>

	<main>
		<div class="sokoban-grid">
			{#each grid as row, r}
				{#each row as cell, c}
					<div class="cell {cell}">
						{#if cell === 'player'}<div class="player"></div>{/if}
						{#if cell === 'crate'}<div class="crate"></div>{/if}
						{#if cell === 'target'}<div class="target"></div>{/if}
					</div>
				{/each}
			{/each}
		</div>

		<div class="side-panel">
			<div class="stat-box">
				<h3>CYCLES</h3>
				<div class="value">000</div>
			</div>
			<div class="stat-box orange">
				<h3>TRACES</h3>
				<div class="value">000</div>
			</div>
			<button class="action-btn">DEREZZ_SYSTEM</button>
		</div>
	</main>
</div>

<style>
	.game-container {
		padding: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	header {
		text-align: center;
		margin-bottom: 50px;
	}

	.tron-title-container {
		position: relative;
		display: inline-block;
	}

	.tron-title {
		font-size: 3rem;
		margin: 0;
		font-weight: 900;
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-style: italic;
	}

	.glow-bar {
		height: 4px;
		background: var(--color-primary);
		width: 100%;
		margin-top: 5px;
		box-shadow: 0 0 15px var(--color-primary);
	}

	.status-line {
		font-size: 0.8rem;
		opacity: 0.8;
		font-family: 'Orbitron', sans-serif;
		margin-top: 15px;
		color: #fff;
	}

	main {
		display: flex;
		gap: 40px;
		align-items: flex-start;
	}

	.sokoban-grid {
		display: grid;
		grid-template-columns: repeat(10, 40px);
		grid-template-rows: repeat(10, 40px);
		border: 4px double var(--color-primary);
		background: #000;
		box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
		background-image: 
			linear-gradient(rgba(0, 210, 255, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 210, 255, 0.1) 1px, transparent 1px);
		background-size: 40px 40px;
	}

	.cell {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.player {
		width: 20px;
		height: 20px;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 0 15px #fff, 0 0 30px var(--color-primary);
	}

	.crate {
		width: 30px;
		height: 30px;
		background: var(--theme-synth-accent);
		border: 2px solid #fff;
		box-shadow: 0 0 15px var(--theme-synth-accent);
		border-radius: 0px;
	}

	.target {
		width: 15px;
		height: 15px;
		border: 2px solid #fff;
		box-shadow: 0 0 10px #fff;
	}

	.side-panel {
		width: 200px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.stat-box {
		padding: 15px;
		border-left: 4px solid var(--color-primary);
		background: rgba(0, 210, 255, 0.1);
	}

	.stat-box.orange {
		border-color: var(--theme-synth-accent);
		background: rgba(255, 157, 0, 0.1);
		color: var(--theme-synth-accent);
	}

	.stat-box h3 {
		margin: 0;
		font-size: 0.7rem;
		opacity: 0.8;
		letter-spacing: 0.1em;
	}

	.stat-box .value {
		font-size: 2rem;
		font-weight: 900;
	}

	.action-btn {
		background: transparent;
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
		padding: 15px;
		font-weight: 900;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
	}

	.action-btn:hover {
		background: var(--color-primary);
		color: #000;
		box-shadow: 0 0 20px var(--color-primary);
	}
</style>
