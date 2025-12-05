// function: handle the button click event
function clickButton() {
    // extract the all buttons in a NodeList
    const buttons = document.querySelectorAll(".buttons button");
    
    // iterate and unpress any pressed buttonsd
    for (const button of buttons) {
        button.classList.remove("pressed");
    }

    // if not pressed then press the button
    if (!this.classList.contains("pressed")) {
        this.classList.add("pressed");
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
    // iterate to create 9 cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.setAttribute('ondrop', 'cloneDrop(event)'); 
        cell.setAttribute('ondragover', 'allowDrop(event)');
        document.querySelector('.game').appendChild(cell);
    }

    // set buttons' onclick handlers
    const buttons = document.querySelectorAll(".buttons button");
    for (const button of buttons) {
        button.onclick = clickButton;
    }
}

// imagine if i didn't call main() lmao
main();