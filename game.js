// function: clear grid of any images in any grid cells
function resetGrid() {
    // select all cells inside the grid
    const gameContainer = document.querySelector('.game');
    const cells = gameContainer.querySelectorAll('.cell'); 

    // iterate through each cell and remove any images if present
    for (const cell of cells) {
        cell.innerHTML = '';
    }
}

// function: play the game in easy mode
function playEasy() {
    resetGrid();
    console.log("Game mode set to EASY");
    // Add logic for a simple random CPU move
}

// function: play the game in medium mode
function playMedium() {
    resetGrid();
    console.log("Game mode set to MEDIUM");
    // Add logic for basic blocking/winning moves
}

// function: play the game in hard mode
function playHard() {
    resetGrid();
    console.log("Game mode set to HARD");
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

// function: handle data transfer of the X/O image while dragging to a target grid cell
function whileDrag(event) {
    event.dataTransfer.setData("text", event.target.id);
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
        const clone = sourceElement.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("draggable");
        clone.classList.remove("drag-source");
        targetCell.appendChild(clone);
    }
}

// function: master client code
function main() {
    // Check if cells already exist to prevent re-creation on a soft reset/mode change
    const gameContainer = document.querySelector('.game');
    if (gameContainer.children.length === 0) {
        // iterate to create 9 cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.setAttribute('ondrop', 'cloneDrop(event)'); 
            cell.setAttribute('ondragover', 'allowDrop(event)');
            gameContainer.appendChild(cell);
        }
    }

    // set buttons' onclick handlers
    const buttons = document.querySelectorAll(".buttons button");
    for (const button of buttons) {
        button.onclick = clickButton;
    }
}

// imagine if i didn't call main() lmao
main();