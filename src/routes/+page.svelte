<header>
	<h1>solvAIt</h1>
	<p>AI-powered puzzle-solving powerhouse</p>
</header>

<main>
	<div class="card">
		<h2>Killer Sudoku</h2>
		<p>Logic-based masterpiece of cage constraints and combinatorial brilliance.</p>
		<a href="/killer-sudoku">Open Solver</a>
	</div>

	<div class="card disabled">
		<h2>Sokoban</h2>
		<p>The ultimate test of spatial reasoning and pathfinding precision.</p>
		<span>Coming Soon</span>
	</div>

	<div class="card disabled">
		<h2>Reverse Game of Life</h2>
		<p>Reverse-engineering cellular automata with mind-bending creativity.</p>
		<span>Coming Soon</span>
	</div>
</main>

<style>
	header {
		text-align: center;
		padding: 50px 20px;
	}
	main {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
		max-width: 1000px;
		margin: 0 auto;
		padding: 20px;
	}
	.card {
		padding: 30px;
		border: 1px solid #eee;
		border-radius: 12px;
		text-align: center;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}
	.card:hover:not(.disabled) {
		transform: translateY(-5px);
	}
	.card.disabled {
		opacity: 0.6;
		background: #f9f9f9;
	}
	a {
		display: inline-block;
		margin-top: 20px;
		padding: 10px 20px;
		background: #007bff;
		color: white;
		text-decoration: none;
		border-radius: 6px;
	}
	h2 {
		margin-top: 0;
	}
</style>
