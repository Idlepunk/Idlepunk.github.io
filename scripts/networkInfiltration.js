// Idlepunk by Asher is licensed under CC BY-NC-SA 4.0 - https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
/*jshint esversion: 6 */
/*jshint eqeqeq: true */
/*jshint supernew: true */
/*jshint multistr: true */
const grid = new function() {
    const canvas = document.getElementById("hackGame");
    if (canvas.getContext) {
        this.ctx = canvas.getContext("2d"),
            // Base width of lines. 
            this.ctx.lineWidth = "3",
            this.dimensions = {
                // Dimensions of the display area, change in HTML file as well.
                gridHeight: 600,
                gridWidth: 600,
                // Number of cells you want on the grid.
                // Note: Currently maps I made are for 10x10 grids, changing the number of cells will require new maps.
                cellNumX: 10,
                cellNumY: 10,
                cellPadding: 30
            },
            // Sets the dimensions of cells
            this.dimensions.cellWidth = this.dimensions.gridWidth / this.dimensions.cellNumX,
            this.dimensions.cellHeight = this.dimensions.gridHeight / this.dimensions.cellNumY,
            // Sets the dimensions in the canvas.
            this.ctx.canvas.width = this.dimensions.gridWidth,
            this.ctx.canvas.height = this.dimensions.gridHeight,
            this.coords = {
                // Coordinates of rectangles in grid, will be set after number of rectangles is calculated.
                cellCoords: [],
                x: 0,
                y: 0,
                // Starting position of the pointer.
                pointerLoc: {
                    x: 0,
                    y: 0
                }
            },
            this.ICEAI = {
                //stepsTaken: 0,
                //path: null,
                targets: null,
                isHunting: false,
                playerActionTaken: false,
                flash: {
                    ticksToFlash: 20,
                    ticksSinceLastFlash: 0
                }
            },
            this.maps = {
                // Maps are made by drawing these 3 arrays.
                // Remember, these array are accessed using array[Y][X], NOT array[x][y]
                // The number corresponds to what item will be in that array position.
                // 0 = blank
                // 1 = start
                // 2 = end
                // 3 = firewall
                // 4 = ICE
                // 5 = server
                gridItemMap: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
                    [0, 3, 5, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 0, 0, 3, 3, 3],
                    [0, 0, 0, 0, 0, 0, 4, 3, 5, 5],
                    [0, 0, 0, 0, 4, 0, 4, 3, 3, 3],
                    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 4, 0, 0, 3, 3],
                    [5, 0, 0, 0, 0, 4, 0, 0, 3, 2]
                ],
                // Where lines should appear running through the grid.
                // two 1s must be touching to draw a line between those rectangles.
                lineMap: [
                    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
                    [1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
                    [1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
                    [1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
                    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
                    [1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
                    [1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
                ],
                // Where the player has access to.
                accessMap: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                // Where ICE is currently located.
                ICELocationMap: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            },
            this.playerItems = {
                ICEPick: 30,
                dummyBarrier: 30,
                virtualServer: 30
            };
    }
};
const gridItem = function(name, description, requirements, fillColor) {
    this.name = name;
    this.description = description;
    this.requirements = requirements;
    this.fillColor = fillColor;
};

gridItem.prototype.renderCell = function(x, y) {
    this.drawGridItem(x, y);
}

gridItem.prototype.drawGridItem = function(x, y) {
     // TOO MANY IFS!
    if (this.fillColor) {
        renderCellFill(x, y, this.fillColor);
    }
    if (checkCellIsAccessed(x, y)) {
        renderCellOutline(x, y, "#00ff00");
    }
    if (grid.maps.ICELocationMap[y][x] === 1 && grid.ICEAI.flash.ticksSinceLastFlash >= (grid.ICEAI.flash.ticksToFlash / 2)) {
        renderCellInternalOutline(x, y, 'red');
    }   
}

grid.gridItem = [
    new gridItem(
        "Switch",
        "There is nothing of import here",
        "Requires a Virtual Server to capture",
        false),
    new gridItem(
        "Entry Node",
        "Your attack starts here",
        false,
        "#00ff00"),
    new gridItem(
        "Node Core",
        "Contains large quantities of sensitive information",
        "Requires an ICEPick, Dummy Barrier & Virtual Server to capture",
        "#283747"),
    new gridItem(
        "Firewall",
        "Prevents access",
        "Requires a Dummy Barrier to capture",
        "grey"),
    new gridItem(
        "ICE",
        "Attacks Intruders",
        "Requires an ICE Pick to capture",
        "#E74C3C"),
    new gridItem(
        "Server",
        "Contains information",
        "Requires an ICEPick & Dummy Barrier to capture",
        "#2980B9")
];

function startHackGame() {
    // First time run.
    createGridCoordinates();
    refreshNetworkInfiltration();
    displayPointerText();
    //drawPointerOnCell();
    ICEHunt(); // Happens asynchronously.
}

function refreshNetworkInfiltration() {
    // Refreshes the UI.
    updateItemCountDisplay();
    displayPointerText();
    grid.ctx.clearRect(0, 0, grid.dimensions.gridWidth, grid.dimensions.gridHeight);
    drawLinesBetweenCells();
    drawCellBase();
    drawCellItems();
    updateICEHunt();
    drawPointerOnCell();
    if (grid.ICEAI.flash.ticksSinceLastFlash >= grid.ICEAI.flash.ticksToFlash){
        grid.ICEAI.flash.ticksSinceLastFlash = 0;
    }
    else {
        grid.ICEAI.flash.ticksSinceLastFlash ++;
    }
}

function createGridCoordinates() {
    gridDimensions();
    gridCellCoords();

    function gridDimensions() {
        // Creates empty 2d grid based on how many cells can fit inside.
        //const cellNumX = grid.dimensions.gridWidth / grid.dimensions.cellWidth;
        //const cellNumY = grid.dimensions.gridHeight / grid.dimensions.cellHeight;
        const cellNumX = grid.dimensions.cellNumX;
        const cellNumY = grid.dimensions.cellNumY;
        grid.coords.cellCoords = new Array(cellNumY);
        for (let i = 0; i < cellNumX; i++) {
            grid.coords.cellCoords[i] = [];
        }
    }

    function gridCellCoords() {
        // Creates coords for individual cells.
        // Coords are based off of dimensions and padding of cells.
        for (let y = 1; y < grid.dimensions.gridHeight; y += grid.dimensions.cellHeight) {
            for (let x = 1; x < grid.dimensions.gridWidth; x += grid.dimensions.cellWidth) {
                grid.coords.cellCoords[grid.coords.x][grid.coords.y] = {
                    x: x,
                    y: y
                };
                grid.coords.x++;
            }
            grid.coords.y++;
            grid.coords.x = 0;
        }
    }
}

function renderCellFill(x, y, color) {
    // Draws a full color square.
    grid.ctx.lineWidth = "3";
    grid.ctx.fillStyle = color;
    // Because canvas straddles pixels, the size of filled cells should be increased by 2 pixels to stop blurry mixed colors.
    // A better solution may be to clear this area before drawing to it, the problem is that the extra blurry parts would remain.
    // Clearing an area larger than the rectangle would mean that lines between them would also be cleared.
    // I could clear it then draw the lines then draw the rectangles.
    const drawX = grid.coords.cellCoords[x][y].x - 2;
    const drawY = grid.coords.cellCoords[x][y].y - 2;
    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding + 4;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding + 4;
    grid.ctx.fillRect(drawX, drawY, cellWidth, cellHeight);
}

function renderCellOutline(x, y, color) {
    // Draws the outline of a square.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    const drawX = grid.coords.cellCoords[x][y].x;
    const drawY = grid.coords.cellCoords[x][y].y;
    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding;
    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
}

function renderCellInternalOutline(x, y, color) {
    // Draws the outline of a square with somne negative padding.
    const bonusPad = 3; // px
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    const drawX = grid.coords.cellCoords[x][y].x + bonusPad;
    const drawY = grid.coords.cellCoords[x][y].y + bonusPad;
    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding - (bonusPad * 2);
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding - (bonusPad * 2);
    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
}

function renderLineBetweenCells(startXC, startYC, endXC, endYC, color) {
    // Draws a line between two points.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    const Xoffset = (grid.dimensions.cellWidth - grid.dimensions.cellPadding) / 2;
    const Yoffset = (grid.dimensions.cellHeight - grid.dimensions.cellPadding) / 2;
    const startX = grid.coords.cellCoords[startXC][startYC].x + Xoffset;
    const startY = grid.coords.cellCoords[startXC][startYC].y + Yoffset;
    const endX = grid.coords.cellCoords[endXC][endYC].x + Xoffset;
    const endY = grid.coords.cellCoords[endXC][endYC].y + Yoffset;
    grid.ctx.beginPath();
    grid.ctx.moveTo(startX, startY);
    grid.ctx.lineTo(endX, endY);
    //grid.ctx.lineCap = "square";
    grid.ctx.stroke();
}

function clearCellRendering(x, y) {
    // Hides a grid square.
    const hideX = grid.coords.cellCoords[x][y].x;
    const hideY = grid.coords.cellCoords[x][y].y;
    const cellWidth = grid.dimensions.cellWidth;
    const cellHeight = grid.dimensions.cellHeight;
    grid.ctx.clearRect(hideX, hideY, cellWidth, cellHeight);
}

function updateItemCountDisplay() {
    //Updates the displayed number of items.
    HTMLEditor("gridItemICEPick", grid.playerItems.ICEPick);
    HTMLEditor("gridItemDummyBarrier", grid.playerItems.dummyBarrier);
    HTMLEditor("gridItemVirtualServer", grid.playerItems.virtualServer);
}

function drawCellBase() {
    // Draws the grid based on coordinates.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            renderCellOutline(x, y, theme.colorTheme[theme.currentTheme].bodyColor);
        }
    }
}

function drawCellItems() {
    // Fills grid in with objects from the .maps.gridItemMap.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            const gridCoord = grid.maps.gridItemMap[y][x];
            grid.gridItem[gridCoord].renderCell(x, y);
        }
    }
}

function drawPointerOnCell() {
    // Display white outline around cell where pointer is.
    renderCellOutline(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y, "white");
    // Display tooltip of what the pointer is over.
    displayPointerText();
}

function displayPointerText() {
    // Shows text based on what the pointer is over.
    // Array of messages to display. Each element should be displayed on its own line.
    const displayText = getPointerText();
    // Clears text already present.
    HTMLEditor("hackGameDetailText", "");
    const displayTextLength = displayText.length;
    for (let i = 0; i < displayTextLength; i++) {
        // HTMLEditor() does not support += strings.
        document.getElementById("hackGameDetailText").innerHTML += displayText[i];
        // Inserts hr after every line except the last.
        if (i !== displayTextLength - 1) {
            //document.getElementById("hackGameDetailText").innerHTML += "<hr class='hr'>";
            document.getElementById("hackGameDetailText").innerHTML += "<br>";
        }
    }
}

function getPointerText() {
    const objectType = grid.maps.gridItemMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x];
    // Creates an array of strings.
    // If a string does not apply to the specific object it will be undefined.
    let displayText = [];
    displayText.push(getPointerTextName(objectType));
    displayText.push(getPointerTextDesc(objectType));
    displayText.push(getPointerTextAccess());
    displayText.push(getPointerTextICE());
    displayText.push(getPointerTextRequirements(objectType));
    displayText.push(getPointerTextServerReward(objectType));
    // Removes undefined strings.
    for (let i = displayText.length - 1; i >= 0; i--) {
        if (typeof displayText[i] === "undefined") {
            displayText.splice(i, 1);
        }
    }
    return displayText;
}

function getPointerTextName(objectType) {
    const text = "<span style=color:" + theme.colorTheme[theme.currentTheme].importantColor + ">" + grid.gridItem[objectType].name + "</span>";
    return text;
    //theme.colorTheme[theme.currentTheme].importantColor
}

function getPointerTextDesc(objectType) {
    return grid.gridItem[objectType].description;
}

function getPointerTextRequirements(objectType) {
    if (!checkPointerOverAccessedCell()) {
        return grid.gridItem[objectType].requirements;
    }
}

function getPointerTextAccess() {
    return checkPointerOverAccessedCell() ? "You have <span style='color:green'>access</span> to this" : "You do not have <span style='color:red'>access</span> to this";
}

function getPointerTextICE() {
    const x = grid.coords.pointerLoc.x;
    const y = grid.coords.pointerLoc.y;
    return grid.maps.ICELocationMap[y][x] === 1 ? "<span style='color:red'>ICE</span> is present here" : undefined;
}

function getPointerTextServerReward(objectType) {
    // If pointer is over unaccessed server.
    if (objectType === 5 && !checkPointerOverAccessedCell()) {
        let amount = formatBytes(calculateDataReward());
        amount = "<span class='important'>" + amount + "</span>";
        return "Passive probing suggests server contains " + amount + " worth of data";
    }
}

function drawLinesBetweenCells() {
    // Draws horizontal lines from maps.lineMap.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            drawHorizontalLines(x, y);
            drawVerticalLines(x, y);
        }
    }
}

function drawHorizontalLines(x, y) {
    if (checkForXLineNeighbour(x, y)) {
        // Two adjacent cells that have access will have a green line between them.
        if (checkCellIsAccessed(x, y) && checkAccessRight(x, y)) {
            renderLineBetweenCells(x, y, x + 1, y, "#00ff00");
        }
        // If one or both do not have access, the default color will be applied.
        else {
            renderLineBetweenCells(x, y, x + 1, y, theme.colorTheme[theme.currentTheme].importantColor);
        }
        // Covers lines that overlap cells.
        renderCellFill(x, y, "black");
        renderCellFill(x + 1, y, "black");
    }
}

function drawVerticalLines(x, y) {
    if (checkForYLineNeighbour(x, y)) {
        // Two adjacent cells that have access will have a green line between them.
        if (checkCellIsAccessed(x, y) && checkAccessBelow(x, y)) {
            renderLineBetweenCells(x, y, x, y + 1, "#00ff00");
        }
        // If one or both do not have access, the default color will be applied.
        else {
            renderLineBetweenCells(x, y, x, y + 1, theme.colorTheme[theme.currentTheme].importantColor);
        }
        // Covers lines that overlap cells.
        renderCellFill(x, y, "black");
        renderCellFill(x, y + 1, "black");
    }
}

function checkForXLineNeighbour(x, y) {
    // Checks if there is a 1 to the right of x on the lineMap.
    // If x is on a rightmost cell, nothing can be to the right of it so return false.
    return x === grid.maps.lineMap[y].length - 1 ? false : grid.maps.lineMap[y][x] === 1 && grid.maps.lineMap[y][x + 1] === 1;
}

function checkForYLineNeighbour(x, y) {
    // Checks if there is a 1 below y in the lineMap.
    return y === grid.maps.lineMap[x].length - 1 ? false : grid.maps.lineMap[y][x] === 1 && grid.maps.lineMap[y + 1][x] === 1;
}
document.onkeydown = function(e) {
    // Player inputs.
    // Gets input.
    e = e || window.event;
    // Different keys call different functions.
    // foo = {bar: () => baz()} will not call baz() when foo is initialized, baz can be called through foo().
    const actionFromInput = {
        // Move Left.
        37: () => movePointerLeft(), // Left Arrow
        65: () => movePointerLeft(), // A
        100: () => movePointerLeft(), // Numpad 4
        // MoveRight.
        39: () => movePointerRight(), // Right Arrow
        68: () => movePointerRight(), // D
        102: () => movePointerRight(), // Numpad 6
        // Move Down.
        40: () => movePointerDown(), // Down Arrow
        83: () => movePointerDown(), // S
        98: () => movePointerDown(), // Numpad 2
        // Move Up.
        87: () => movePointerUp(), // Up arrow
        38: () => movePointerUp(), // W
        104: () => movePointerUp(), // Numpad 8
        // Move diagonally left/up.
        36: () => {
            movePointerLeft();
            movePointerUp();
        }, // Home
        103: () => {
            movePointerLeft();
            movePointerUp();
        }, // Numpad 7
        // Move diagonally right/up.
        33: () => {
            movePointerRight();
            movePointerUp();
        }, // Page Up
        105: () => {
            movePointerRight();
            movePointerUp();
        }, // Numpad 9
        // Move diagonally left/down.
        35: () => {
            movePointerLeft();
            movePointerDown();
        }, // End
        97: () => {
            movePointerLeft();
            movePointerDown();
        }, // Numpad 1
        // Move diagonally right/down.
        34: () => {
            movePointerRight();
            movePointerDown();
        }, // Page Down
        99: () => {
            movePointerRight();
            movePointerDown();
        }, // Numpad 3
        // Action.
        32: () => playerAction(), // Space bar
        69: () => playerAction(), // E
        13: () => playerAction(), // Enter
        107: () => playerAction() // +
    }[e.keyCode]; // Determines what function actionFromInput() should call.
    // If an input keyCode isn't a key in actionFromInput, it will be undefined.
    if (actionFromInput) {
        actionFromInput();
        refreshNetworkInfiltration();
        drawPointerOnCell();
    }
    else {
        console.log(e.key + " is not bound to anything.");
    }
};

function movePointerUp() {
    // If pointer is not at top, move pointer up.
    if (grid.coords.pointerLoc.y !== 0) {
        grid.coords.pointerLoc.y--;
    }
}

function movePointerDown() {
    // If pointer is not at bottom, move pointer down.
    if (grid.coords.pointerLoc.y !== grid.coords.cellCoords.length - 1) {
        grid.coords.pointerLoc.y++;
    }
}

function movePointerLeft() {
    // If pointer is not leftmost. move pointer left.
    if (grid.coords.pointerLoc.x !== 0) {
        grid.coords.pointerLoc.x--;
    }
}

function movePointerRight() {
    // If pointer is not rightmost, move pointer right.
    if (grid.coords.pointerLoc.x !== grid.coords.cellCoords[0].length - 1) {
        grid.coords.pointerLoc.x++;
    }
}

function playerAction() {
    // The pointer is interacting with something on the grid.
    const pointerLocation = grid.maps.gridItemMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x];
    // Things that the player can interact with.
    const itemInteractions = {
        0: () => actionOnEmpty(),
        1: () => undefined,
        2: () => actionOnNodeCore(),
        3: () => actionOnFirewall(),
        4: () => actionOnICE(),
        5: () => actionOnServer()
    }[pointerLocation];
    // If the pointer is over an interactable thing.
    if (itemInteractions) {
        itemInteractions();
        updateItemCountDisplay();
    }
    if (grid.ICEAI.playerActionTaken) {
        grid.ICEAI.playerActionTaken = false;
        ICEHunt();
    }
}

function actionOnEmpty() {
    // If the target is:
    // 1. On a line.
    // 2. Adjacent to an accessible location.
    // 3. Not already accessed.
    // 4. The player has an item to use here.
    if (checkCanEnableAccessOnCell() && grid.playerItems.virtualServer >= 1) {
        // Remove a virtual server.
        grid.playerItems.virtualServer--;
        // Change this maps.accessMap location from unaccessed to accessed.
        enableAccessOnCell(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y)
        grid.ICEAI.playerActionTaken = true;
    }
}

function actionOnNodeCore() {
    // If the player attempts an action on the end goal.
    // Should be a win condition.
    if (checkCanEnableAccessOnCell() && grid.playerItems.ICEPick >= 1 && grid.playerItems.dummyBarrier >= 1 && grid.playerItems.virtualServer >= 1) {
        grid.playerItems.ICEPick--;
        grid.playerItems.dummyBarrier--;
        grid.playerItems.virtualServer--;
        enableAccessOnCell(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y)
        grid.ICEAI.playerActionTaken = true;
    }
}

function actionOnServer() {
    // Should give the player a reward.
    if (checkCanEnableAccessOnCell() && grid.playerItems.ICEPick >= 1 && grid.playerItems.dummyBarrier) {
        // Removes items required to access a server.
        grid.playerItems.ICEPick--;
        grid.playerItems.dummyBarrier--;
        // Mark location accessed.
        enableAccessOnCell(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y)
        giveDataReward();
        grid.ICEAI.playerActionTaken = true;
    }
}

function giveDataReward() {
    const rewardAmount = calculateDataReward();
    addData(rewardAmount);
}

function calculateDataReward() {
    // At the moment servers reward data equal to the next upgrade cost of the best item the player owns.
    const item = itemList[getBestUnlockedItem()];
    return item.upgrade.nextUpgradeCost;
}

function getBestUnlockedItem() {
    // Returns the highest tier item that the player has unlocked.
    for (let i = itemList.length - 1; i >= 0; i--) {
        if (itemList[i].itemData.itemCount !== 0) {
            return i;
        }
    }
    return 0;
}

function actionOnFirewall() {
    // Should block the player until they access it.
    if (checkCanEnableAccessOnCell() && grid.playerItems.dummyBarrier >= 1) {
        grid.playerItems.dummyBarrier--;
        enableAccessOnCell(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y)
        grid.ICEAI.playerActionTaken = true;
    }
}

function actionOnICE() {
    // Should attack the player until they access it.
    if (checkCanEnableAccessOnCell() && grid.playerItems.ICEPick >= 1) {
        grid.playerItems.ICEPick--;
        enableAccessOnCell(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y);
        grid.ICEAI.isHunting = true;
        grid.ICEAI.playerActionTaken = true;
    }
}

function checkCellIsOnALine() {

}

function checkPointerOverLine() {
    // Checks if the pointer is over a line.
    return grid.maps.lineMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] === 1;
}

function checkPointerOverAccessedCell() {
    // If the pointer is currently on an accessed area.
    return checkCellIsAccessed(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y);
}

function checkCanEnableAccessOnCell() {
    // If cell can be changed from unaccessed to accessed.
    return checkPointerOverLine() && checkPointerNextToAccessArea() && !checkPointerOverAccessedCell();
}

function enableAccessOnCell(x, y) {
    grid.maps.accessMap[y][x] = 1;
}

function checkCellIsAccessed(x, y) {
    return grid.maps.accessMap[y][x] === 1;
}

function checkPointerNextToAccessArea() {
    // Checks if pointer is next to an area that is accessed.
    const x = grid.coords.pointerLoc.x;
    const y = grid.coords.pointerLoc.y;
    return (checkAccessAbove(x, y) || checkAccessBelow(x, y) || checkAccessLeft(x, y) || checkAccessRight(x, y));
}

function checkAccessAbove(x, y) {
    // If y is 0 then the cell is at the top of the grid so nothing can be above it.
    // Else check if the cell above (y-1) has a value of 1 (not truthy, but specifically 1).
    return y === 0 ? false : checkCellIsAccessed(x, y-1);
}

function checkAccessBelow(x, y) {
    return y === grid.maps.accessMap.length - 1 ? false : checkCellIsAccessed(x, y+1)
}

function checkAccessLeft(x, y) {
    return x === 0 ? false : checkCellIsAccessed(x-1, y);
}

function checkAccessRight(x, y) {
    return x === grid.maps.accessMap[y].length - 1 ? false : checkCellIsAccessed(x+1, y);
}

function ICEHunt() {
    getListOfServers();
    getPathsForICETargets();
    //new EasyStar.js().calculate()
    if (grid.ICEAI.isHunting) {
        increaseICEHuntSteps();
        getPathsForICETargets();
        refreshNetworkInfiltration();
    }
}

function calculateICEHuntPath(i) {
    const es = new EasyStar.js();
    es.setIterationsPerCalculation(1000);
    es.setGrid(grid.maps.lineMap);
    es.setAcceptableTiles([1]);
    es.findPath(9, 9, grid.ICEAI.targets[i].x, grid.ICEAI.targets[i].y, function(path) {
        if (path === null) {
            console.log("No possible path for ICE.");
        }
        else {
            //console.log(path);
            //return path;
            addICEHuntPath(path, i);
        }
    });
    es.calculate();
}

function getPathsForICETargets() {
    for (let i = grid.ICEAI.targets.length - 1; i >= 0; i--) {
        calculateICEHuntPath(i);
    }
}

function addICEHuntPath(path, i) {
    grid.ICEAI.targets[i].path = path;
}

function getListOfServers() {
    // Populates an array of coordinates where servers exist.
    // If the array already exists, nothing will happen.
    if (grid.ICEAI.targets === null) {
        loopThroughtItemMap();
    }

    function loopThroughtItemMap() {
        grid.ICEAI.targets = [];
        for (let y = 0; y < grid.maps.gridItemMap.length; y++) {
            for (let x = 0; x < grid.maps.gridItemMap.length; x++) {
                detectServer(x, y);
            }
        }
    }

    function detectServer(x, y) {
        if (grid.maps.gridItemMap[y][x] === 5) {
            grid.ICEAI.targets.push({
                x: x,
                y: y
            });
        }
    }
}

function increaseICEHuntSteps() {
    for (let i = grid.ICEAI.targets.length - 1; i >= 0; i--) {
        if (typeof grid.ICEAI.targets[i].stepsTaken === "undefined") {
            grid.ICEAI.targets[i].stepsTaken = 0;
        }
        else if (grid.ICEAI.targets[i].stepsTaken < grid.ICEAI.targets[i].path.length) {
            grid.ICEAI.targets[i].stepsTaken++;
        }
    }
}

function updateICEHunt() {
    // This is a clusterfuck
    if (grid.ICEAI.isHunting) { // If ICE has been triggered.
        for (let tarI = grid.ICEAI.targets.length - 1; tarI >= 0; tarI--) { // Loop through ICE targets.
            if (grid.ICEAI.targets[tarI].path) { // If a path has been found for the target.
                for (let stepI = 0; stepI < grid.ICEAI.targets[tarI].stepsTaken; stepI++) { // Loop through the steps in the path.
                    setICEAILocation(tarI, stepI); // Update grid with the current locations of ICE.
                }
            }
        }
    }
}

function setICEAILocation(target, step) {
    grid.maps.ICELocationMap[grid.ICEAI.targets[target].path[step].y][grid.ICEAI.targets[target].path[step].x] = 1;
}
