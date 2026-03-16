<script lang="ts">
	// Placeholder for GoL logic
	const grid = Array(20).fill(0).map(() => Array(20).fill(false));
	// Glider
	grid[2][3] = true;
	grid[3][4] = true;
	grid[4][2] = true;
	grid[4][3] = true;
	grid[4][4] = true;
</script>

<div class="game-container">
	<header>
		<div class="matrix-title-container">
			<h1 class="matrix-title">SHELL_EXTRACTOR_v0.1</h1>
			<div class="scanline"></div>
		</div>
		<div class="terminal-info">
			>> DECRYPTING_BIOLOGICAL_FLOW...<br>
			>> SOURCE_RECONSTRUCTION: 78%_COMPLETE
		</div>
	</header>

	<main>
		<div class="gol-grid">
			{#each grid as row}
				{#each row as alive}
					<div class="cell" class:alive></div>
				{/each}
			{/each}
		</div>

		<div class="terminal-panel">
			<div class="output">
				<div class="line">GEN_CYCLE: 0102</div>
				<div class="line">BIO_COUNT: 0042</div>
				<div class="line">STREAM: 0x82f4e...</div>
			</div>
			<div class="input-line">
				<span class="prompt">></span>
				<span class="cursor">█</span>
			</div>
		</div>
	</main>
</div>

<style>
	.game-container {
		padding: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'JetBrains Mono', monospace;
	}

	header {
		width: 100%;
		max-width: 800px;
		margin-bottom: 40px;
	}

	.matrix-title-container {
		position: relative;
		overflow: hidden;
		display: inline-block;
		padding: 5px 15px;
		background: rgba(0, 255, 65, 0.1);
		border-left: 4px solid var(--color-primary);
	}

	.matrix-title {
		font-size: 1.8rem;
		margin: 0;
		color: var(--color-primary);
		letter-spacing: 0.1em;
		text-shadow: 0 0 10px var(--color-primary);
	}

	.scanline {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: rgba(0, 255, 65, 0.3);
		animation: scan 3s linear infinite;
	}

	@keyframes scan {
		from { top: -10%; }
		to { top: 110%; }
	}

	.terminal-info {
		font-size: 0.8rem;
		margin-top: 15px;
		color: var(--color-primary);
		opacity: 0.8;
		line-height: 1.5;
	}

	main {
		display: flex;
		gap: 30px;
		width: 100%;
		max-width: 1000px;
		justify-content: center;
	}

	.gol-grid {
		display: grid;
		grid-template-columns: repeat(20, 25px);
		grid-template-rows: repeat(20, 25px);
		border: 1px solid var(--theme-matrix-dim);
		gap: 1px;
		background: #000;
	}

	.cell {
		width: 25px;
		height: 25px;
		background: transparent;
		border: 1px solid rgba(0, 59, 0, 0.5);
	}

	.cell.alive {
		background: var(--color-primary);
		box-shadow: 0 0 10px var(--color-primary), 0 0 20px rgba(0, 255, 65, 0.3);
		border: 1px solid #fff;
	}

	.terminal-panel {
		width: 250px;
		background: #000;
		border: 1px solid var(--color-primary);
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		box-shadow: inset 0 0 20px rgba(0, 255, 65, 0.1);
	}

	.output {
		font-size: 0.85rem;
		color: var(--color-primary);
		opacity: 0.9;
	}

	.line {
		margin-bottom: 8px;
	}

	.input-line {
		display: flex;
		gap: 10px;
		color: var(--color-primary);
		font-weight: bold;
	}

	.cursor {
		animation: blink 0.8s infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style>
