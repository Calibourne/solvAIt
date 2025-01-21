document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("sudoku-grid").querySelector("tbody");

    let isCageMode = false; // Flag for Add Cage mode
    let selectedCells = []; // Keep track of selected cells for a cage
    const MAX_CAGE_CELLS = 9; // Maximum number of cells allowed in a cage

    const cages = []; // List of all cages (each cage is an array of cells)
    const graph = {}; // Stores nodes (cages) and their adjacency lists
    const colors = {}; // Stores the assigned colors for each cage
    const colorPalette = [
        /* List of colors */
        "#FFD700", // Gold
        "#FFA07A", // Light Salmon
        "#20B2AA", // Light Sea Green
        "#9370DB", // Medium Purple
        "#FF6347", // Tomato
        "#7B68EE", // Medium Slate Blue
        "#90EE90", // Light Green
        "#000080", // Dark Blue
        
    ]; // Example colors

    // Generate 9x9 grid with coordinate headers
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");

        // Add row header (1-9)
        const rowHeader = document.createElement("th");
        rowHeader.textContent = row + 1; // Row labels
        rowHeader.classList.add("row-header");
        tr.appendChild(rowHeader);

        // Add Sudoku cells (A1, B1, ..., I9)
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const input = document.createElement("input");

            input.setAttribute("type", "text"); // Use text input
            input.setAttribute("maxlength", "1"); // Only allow single digits
            input.setAttribute("id", `cell-${row}-${col}`);
            td.dataset.row = row; // Store row index
            td.dataset.col = col; // Store column index
            td.appendChild(input);

            // Toggle cell selection in Cage Mode
            td.addEventListener("click", () => {
                if (isCageMode) {
                    toggleCellSelection(td);
                }
            });

            tr.appendChild(td);
        }

        grid.appendChild(tr);
    }

    // Handle "Add Cage" button click
    document.getElementById("add-cage-button").addEventListener("click", () => {
        if (!isCageMode) {
            // Enable Cage Mode
            isCageMode = true;
            document.getElementById("add-cage-button").textContent = "Assign Cage";
        } else {
            // Assign Cage Value
            if (selectedCells.length === 0) {
                alert("No cells selected. Please select cells for the cage.");
                return;
            }

            // Validate adjacency
            if (!areCellsAdjacent(selectedCells)) {
                alert("Selected cells are not adjacent. Please select adjacent cells.");
                return;
            }

            const cageSize = selectedCells.length;
            const lowerBound = calculateLowerBound(cageSize); // Calculate the minimum possible sum
            const upperBound = calculateUpperBound(cageSize); // Calculate the maximum possible sum

            let cageSum;
            do {
                cageSum = prompt(`Enter the sum for the cage (min ${lowerBound}, max ${upperBound}):`);
            } while (isNaN(cageSum) || cageSum.trim() === "");
            if (cageSum) {
                const numericCageSum = parseInt(cageSum, 10);

                // Validate the sum
                if (numericCageSum < lowerBound || numericCageSum > upperBound) {
                    alert(
                        `The sum must be between ${lowerBound} and ${upperBound} for a cage of size ${cageSize}.`
                    );
                    return;
                }

                const cageIndex = cages.length; // New cage index
                cages.push(selectedCells.map((cell) => ({ row: +cell.dataset.row, col: +cell.dataset.col }))); // Save the cage

                addCageToGraph(cageIndex, cages[cageIndex]); // Update the graph
                assignColorToCage(cageIndex); // Assign a color

                updateCageColorsInUI(); // Apply colors to the UI
                saveCage(numericCageSum); // Save the cage in the UI

                console.log(`Cage sum entered: ${cageSum}`);
            }

            // Reset Cage Mode
            isCageMode = false;
            selectedCells = [];
            clearCellSelection();
            document.getElementById("add-cage-button").textContent = "Add Cage";
        }
    });

    function saveCage(sum) {
        console.log("Saving cage with sum:", sum);
    
        // Get the first cell in the selected cage
        const [firstCell] = selectedCells;
    
        // Mark all selected cells as part of the cage
        selectedCells.forEach((cell) => {
            cell.classList.add("cage-cell");
        });
    
        // Highlight the first cell to display the cage sum
        firstCell.classList.add("cage-sum-cell");
        firstCell.dataset.cageSum = sum;
    
        // Clear selection
        selectedCells = [];
        clearCellSelection();
    
        console.log("Cage saved successfully.");
    }
    

    // Add the new cage to the graph and update edges
    function addCageToGraph(cageIndex, cageCells) {
        graph[cageIndex] = []; // Initialize the new node

        // Check adjacency with existing cages
        for (let i = 0; i < cages.length - 1; i++) {
            if (areCagesAdjacent(cages[i], cageCells)) {
                graph[cageIndex].push(i); // Connect the new cage to the existing one
                graph[i].push(cageIndex); // Connect the existing cage to the new one
            }
        }
    }

    // Assign a color to the new cage
    function assignColorToCage(cageIndex) {
        const adjacentColors = new Set(graph[cageIndex].map((neighbor) => colors[neighbor]));

        // Assign the smallest available color
        let color = 0;
        while (adjacentColors.has(color)) {
            color++;
        }
        colors[cageIndex] = color; // Assign the color
    }

    // Update the colors of all cages in the UI
    function updateCageColorsInUI() {
        cages.forEach((cage, index) => {
            const color = colorPalette[colors[index] % colorPalette.length]; // Wrap around the palette if needed
            cage.forEach((cell) => {
                const cellElement = document.getElementById(`cell-${cell.row}-${cell.col}`);
                cellElement.style.backgroundColor = color;
            });
        });
    }

    // Calculate the lower bound for the cage sum
    function calculateLowerBound(cageSize) {
        let sum = 0;
        for (let i = 1; i <= cageSize; i++) {
            sum += i; // Add the smallest digits
        }
        return sum;
    }

    // Calculate the upper bound for the cage sum
    function calculateUpperBound(cageSize) {
        let sum = 0;
        for (let i = 9; i > 9 - cageSize; i--) {
            sum += i; // Add the largest digits
        }
        return sum;
    }

    // Check if two cages are adjacent
    function areCagesAdjacent(cageA, cageB) {
        return cageA.some((cellA) =>
            cageB.some(
                (cellB) =>
                    Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col) === 1
            )
        );
    }

    // Toggle cell selection
    function toggleCellSelection(cell) {
        if (cell.classList.contains("cage-cell")) {
            // Prevent selection of cells already in a cage
            alert("This cell is already part of a cage and cannot be selected.");
            return;
        }

        if (selectedCells.includes(cell)) {
            // Deselect cell
            selectedCells = selectedCells.filter((c) => c !== cell);
            cell.classList.remove("selected-cell");
        } else {
            // Restrict selection to a maximum of 9 cells
            if (selectedCells.length >= MAX_CAGE_CELLS) {
                alert(`You can only select up to ${MAX_CAGE_CELLS} cells for a cage.`);
                return;
            }

            // Select cell
            selectedCells.push(cell);
            cell.classList.add("selected-cell");
        }
    }

    // Validate if all selected cells are adjacent
    function areCellsAdjacent(cells) {
        const cellCoords = cells.map((cell) => ({
            row: parseInt(cell.dataset.row, 10),
            col: parseInt(cell.dataset.col, 10),
        }));

        // If there is only one cell, it's always "adjacent" to itself
        if (cellCoords.length <= 1) return true;

        // Check adjacency using a set for visited cells
        const visited = new Set();
        const stack = [cellCoords[0]];
        visited.add(`${cellCoords[0].row},${cellCoords[0].col}`);

        while (stack.length > 0) {
            const { row, col } = stack.pop();
            const neighbors = [
                { row: row - 1, col }, // Up
                { row: row + 1, col }, // Down
                { row, col: col - 1 }, // Left
                { row, col: col + 1 }, // Right
            ];

            for (const neighbor of neighbors) {
                const key = `${neighbor.row},${neighbor.col}`;
                if (
                    cellCoords.some((c) => c.row === neighbor.row && c.col === neighbor.col) &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    stack.push(neighbor);
                }
            }
        }

        // The cells are adjacent if we visited all of them
        return visited.size === cellCoords.length;
    }


    // Clear all selected cell highlights
    function clearCellSelection() {
        const allCells = document.querySelectorAll(".selected-cell");
        allCells.forEach((cell) => cell.classList.remove("selected-cell"));
    }
});
