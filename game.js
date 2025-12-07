// global variable: define array to track the current state of the board
let grid;

// function: update the board state array based off current grid cell images
function updateGrid() {
    const cells = document.querySelectorAll('.cell');

    // regular for loop to iterate through the cells
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        // convert flat zero-indexes (0-8) to 2D coordinates (rows 0-2, cols 0-2)
        const row = Math.floor(i / 3);
        const col = i % 3;

        // check if cell has an image and update grid accordingly
        if (cell.children.length > 0) {
            const img = cell.querySelector('img');
            grid[row][col] = img.alt;
        } else {
            grid[row][col] = null;
        }
    }
    // for debugging: log the current grid state to console
    console.log(grid);
}

// function: clear grid of any images in any grid cells
function resetGrid() {
    // select all 9 cells inside the grid
    const gameContainer = document.querySelector('.game');
    const cells = gameContainer.querySelectorAll('.cell'); 

    // iterate through each cell and remove any images if present
    for (const cell of cells) {
        cell.innerHTML = '';
    }
    
    // reset to empty 2D array
    grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    // Clear the status message
    const statusDisplay = document.getElementById("game-status");
    statusDisplay.innerHTML = "...";
    statusDisplay.style.color = "#888888";
}

// function: check the grid for a win condition
function checkWin() {
    // retrieve status and define a null winner variable
    const statusDisplay = document.getElementById("game-status");
    let winner = null;

    // check rows (iteratively)
    for (let row = 0; row < 3; row++) {
        if (grid[row][0] !== null && grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2]) { 
            winner = grid[row][0];
        }
    }

    // check columns (iteratively)
    for (let col = 0; col < 3; col++) {
        if (grid[0][col] !== null && grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {  
            winner = grid[0][col];
        }
    }

    // check diagonals (top-left to bottom-right)
    if (grid[0][0] !== null && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
        winner = grid[0][0];
    }

    // check anti-diagonals (top-right to bottom-left)
    if (grid[0][2] !== null && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {  
        winner = grid[0][2];
    }

    // display win status
    if (winner) {
        console.log("Winner: " + winner);
        statusDisplay.innerHTML = winner + " WINS!";
        statusDisplay.style.color = "#00ff00";
        return; 
    }

    // check for stalemate (draw)
    let stalemate = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (grid[row][col] != null) {
                stalemate++; 
            }
        }
    }

    // display draw status
    if (stalemate === 9) {
        statusDisplay.innerHTML = "DRAW: NO ONE WINS!";
        statusDisplay.style.color = "#ff3333";
        return;
    } else {
        statusDisplay.innerHTML = "...";
        statusDisplay.style.color = "#888888";
        return;
    }
}

// helper function: initialize game modes and background colors
function initGameMode(modeName, color) {
    resetGrid();
    console.log("Game mode set to " + modeName);
    document.body.style.backgroundColor = color;
}

// function: play the game in easy mode
function playEasy() {
    initGameMode("EASY", "#1d3b2bff");
    // Add logic for a simple random CPU move
}

// function: play the game in medium mode
function playMedium() {
    initGameMode("MEDIUM", "#614f0fff");
    // Add logic for basic blocking/winning moves
}

// function: play the game in hard mode
function playHard() {
    initGameMode("HARD", "#5b1a1aff");
    // Add logic for unbeatable Minimax algorithm
}

// function: handle the button click event
function clickButton() {
    // extract the all buttons in a NodeList
    const buttons = document.querySelectorAll(".buttons button");

    // iterate and unpress any pressed buttons
    for (const button of buttons) {
        button.classList.remove("pressed");
    }

    // if not pressed then press the button
    if (!this.classList.contains("pressed")) {
        this.classList.add("pressed");
    }

    // set difficulty mode based off the selected button
    const mode = this.textContent;
    if (mode === "EASY") {
        playEasy();
    } else if (mode === "MEDIUM") {
        playMedium();
    } else if (mode === "HARD") {
        playHard();
    }
}

// function: handle the deault behavior of dragover event for a target grid cell
function allowDrop(event) {
    event.preventDefault();
}

// function: handle data transfer and status update while dragging
function whileDrag(event) {
    // set the data to be transferred (the ID of the dragged element)
    event.dataTransfer.setData("text", event.target.id);
    
    // update status to moving (white)
    const statusDisplay = document.getElementById("game-status");
    statusDisplay.style.color = "#ffffff";

    // check the alt tag to see if it is X or O
    const piece = event.target.alt; 
    statusDisplay.innerHTML = piece + " IS MOVING";
}

// function: handle the end of a drag event (reset to idle if not dropped)
function endDrag(event) {
    // only reset to idle "..." if the game hasn't just ended (won or drawn)
    const statusDisplay = document.getElementById("game-status");
    if (!statusDisplay.innerHTML.includes("WINS") && !statusDisplay.innerHTML.includes("DRAW")) {
        statusDisplay.innerHTML = "...";
        statusDisplay.style.color = "#888888";
    }
}

// function: handle the drop event to clone the dragged image into a target grid cell
function cloneDrop(event) {
    // first, stop default behavior and retrieve the ID of the dragged element
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const sourceElement = document.getElementById(data);
    let targetCell = event.target;

    // second, ensure the target was dropped onto a full cell
    if (targetCell.tagName === "IMG") {
        return;
    }

    // third, ensure the target was dropped onto a empty cell
    if (targetCell.children.length === 0) {
        // clone the dragged element and remove ANY and ALL unnecessary attributes/classes
        const clone = sourceElement.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("draggable");
        clone.classList.remove("drag-source");
        
        // Remove the dragend listener from the clone so it doesn't bug out inside the board
        clone.removeEventListener('dragend', endDrag);

        // finally, append the clone to the target cell and update the grid state
        targetCell.appendChild(clone);
        updateGrid();
        checkWin();
    }
}

// function: master client code
function main() {
    // initialize grid[][] as a 2D array
    grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    // set initial status display
    const statusDisplay = document.getElementById("game-status");
    statusDisplay.innerHTML = "...";
    statusDisplay.style.color = "#888888";

    // check if cells already exist to prevent re-creation
    const gameContainer = document.querySelector('.game');
    if (gameContainer.children.length === 0) {
        // iteratively create 9 grid cells (images within divs) inside the game container
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.setAttribute('ondrop', 'cloneDrop(event)');
            cell.setAttribute('ondragover', 'allowDrop(event)');
            gameContainer.appendChild(cell);
        }
    }

    // set drag-and-drop event listeners for X and O images (images within divs)
    const dragSources = document.querySelectorAll('.drag-source');
    for (const source of dragSources) {
        source.addEventListener('dragend', endDrag);
        source.addEventListener('dragstart', whileDrag);
    }

    // set buttons' onclick handlers
    const buttons = document.querySelectorAll(".buttons button");
    for (const button of buttons) {
        button.onclick = clickButton;
    }
}

// the one and only... main().
main();