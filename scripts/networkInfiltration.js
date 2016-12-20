// Idlepunk by Asher is licensed under CC BY-NC-SA 4.0 - https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
/*jshint esversion: 6 */
/*jshint eqeqeq: true */
/*jshint supernew: true */
/*jshint multistr: true */

function netWorkInfiltrationConstructor() {
    window.grid = new function() {
        const canvas = document.getElementById("hackGame");
        this.ctx = canvas.getContext("2d");
        // Base width of lines. 
        this.ctx.lineWidth = "3";
        this.dimensions = {
            // Dimensions of the display area, change in HTML file as well.
            gridHeight: 600,
            gridWidth: 600,
            // Number of cells you want on the grid.
            // Note: Currently maps I made are for 10x10 grids, changing the number of cells will require new maps.
            cellNumX: 10,
            cellNumY: 10,
            cellPadding: 30
        };
        this.colors = {
            playerAccess: '#00ff00',
            ICE: 'red',
            pointer: 'white'
        };
        // Sets the dimensions of cells
        this.dimensions.cellWidth = this.dimensions.gridWidth / this.dimensions.cellNumX;
        this.dimensions.cellHeight = this.dimensions.gridHeight / this.dimensions.cellNumY;
        // Sets the dimensions in the canvas.
        this.ctx.canvas.width = this.dimensions.gridWidth;
        this.ctx.canvas.height = this.dimensions.gridHeight;
        this.pointer = {
            x: 0,
            y: 0
        };
        this.ICEAI = {
            targets: [],
            isHunting: false,
            playerActionTaken: false,
            animation: {
                startEvery: 5,
                tickCount: 0
            }
        };
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
            items: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [4, 4, 0, 0, 0, 0, 0, 0, 0, 4],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 5, 5, 5],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
                ],
            // Where connections should appear running through the grid.
            // two 1s must be touching to draw a line between those rectangles.
            connections: [
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
            // Where the player has access to at the start of the game.
            playerAccess: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
        };
        // Clones connections map into ICEConnections
        this.maps.ICEConnections = this.maps.connections.map(function(arr) {return arr.slice();});
    };
}

function cell() {
    this.coords = {};
    this.dimensions = {};
}

cell.prototype.create = function(e) {
    this.name = e.name;
    this.id = e.id;
    this.description = e.description;
    this.costMultiplier = e.costMultiplier;
    this.fillColor = e.fillColor;
};

cell.prototype.renderCell = function() {
    this.drawItem();
    this.drawPlayerAccess();
    this.drawICE();
    this.drawPointer();
};

cell.prototype.drawItem = function(x, y) {
    if (this.fillColor) {
        this.renderCellFill();
    }
};

cell.prototype.drawPlayerAccess = function(x, y) {
    if (this.access === 1) {
        //renderCellOutline(x, y, grid.colors.playerAccess);
        this.renderCellOutline(grid.colors.playerAccess);
    }
};

cell.prototype.drawICE = function() {
    const x = this.coords.x;
    const y = this.coords.y;
    ///if (grid.maps.ICEPresence[y][x].hasICE) {
    if (grid.maps.items[y][x].ICE.hasICE) {
        if (!grid.maps.items[y][x].ICE.pathIntact) {
            this.renderCellInternalOutline(grid.colors.ICE);
        }
        else if (shouldICERender(x, y)) {
            this.renderCellInternalOutline(grid.colors.ICE);
        }
        else {
            this.renderCellInternalOutline("#FF5900");
        }
    }
};

cell.prototype.drawPointer = function() {
    if (grid.pointer.y === this.coords.y && grid.pointer.x === this.coords.x) {
        this.renderCellOutline("white");
    }
};

cell.prototype.renderCellFill = function(color) {
    // Draws a full color square.
    grid.ctx.lineWidth = "4";
    grid.ctx.fillStyle = color || this.fillColor;

    const drawX = this.dimensions.x - 1.5;
    const drawY = this.dimensions.y - 1.5;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding + 3;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding + 3;

    grid.ctx.fillRect(drawX, drawY, cellWidth, cellHeight);
};

cell.prototype.renderCellOutline = function(color) {
    // Draws the outline of a square.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color || this.fillColor;

    const drawX = this.dimensions.x;
    const drawY = this.dimensions.y;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding;

    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
};

cell.prototype.renderCellInternalOutline = function(color) {
    // Draws the outline of a square with somne negative padding.
    const bonusPad = 3;
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color || this.color;

    const drawX = this.dimensions.x + bonusPad;
    const drawY = this.dimensions.y + bonusPad;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding - (bonusPad * 2);
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding - (bonusPad * 2);

    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
};

cell.prototype.action = function() {
    if (canEnableAccessAtPointer() && this.canAffordAccess()) {
        subtractData(this.getCostToAccess())
        const x = this.coords.x;
        const y = this.coords.y;
        enableAccessOnCell(x, y);
        if (this.id === 4) {
            grid.ICEAI.isHunting = true;
        }
        /*
        if (grid.ICEAI.playerActionTaken) {
            grid.ICEAI.playerActionTaken = false;
            ICEHunt();
        }
        */
        ICEHunt();
    }
};

cell.prototype.canAffordAccess = function() {
    return (gameData.dataHacked >= this.getCostToAccess());
}

cell.prototype.getCostToAccess = function() {
    return this.costMultiplier * itemList[getBestUnlockedItem()].itemData.baseCost;
}

function shouldICERender(x, y) {
    //if ((grid.ICEAI.animation.tickCount - grid.maps.ICEPresence[y][x].steps) % grid.ICEAI.animation.startEvery === 0) {
    if ((grid.ICEAI.animation.tickCount - grid.maps.items[y][x].ICE.steps) % grid.ICEAI.animation.startEvery === 0) {
        return false;
    }
    else {
        return true;
    }
}

function getItemData(id) {
    const getData = {
        0: () => getSwitchConstructionData(),
        1: () => getEntryNodeConstrutionData(),
        2: () => getNodeCoreConstructionData(),
        3: () => getFirewallConstructionData(),
        4: () => getICEConstructionData(),
        5: () => getServerConstructionData()
    }[id];
    return getData();
}

function getSwitchConstructionData() {
    return {
        name: "Switch",
        id: 0,
        description: "There is nothing of import here",
        costMultiplier: 1,
        fillColor: false
    };
}

function getEntryNodeConstrutionData() {
    return {
        name: "Entry Node",
        id: 1,
        description: 0,
        costMultiplier: false,
        fillColor: grid.colors.playerAccess
    };
}

function getNodeCoreConstructionData() {
    return {
        name: "Node Core",
        id: 2,
        description: "Contains large quantities of sensitive information",
        costMultiplier: 5,
        fillColor: "#283747"
    };
}

function getFirewallConstructionData() {
    return {
        name: "Firewall",
        id: 3,
        description: "Prevents access",
        costMultiplier: 3,
        fillColor: "grey"
    };
}

function getICEConstructionData() {
    return {
        name: "ICE",
        id: 4,
        description: "Attacks Intruders",
        costMultiplier: 0,
        fillColor: "#E74C3C"
    };
}

function getServerConstructionData() {
    return {
        name: "Server",
        id: 5,
        description: "Contains information",
        costMultiplier: 2,
        fillColor: "#2980B9"
    };
}

function startHackGame() {
    // First time run.
    //gridDimensions();
    populateItemMap();
    populateGrid();

    refreshNetworkInfiltration();
    displayPointerText();

    getListOfServers();
    ICEHunt(); // Happens asynchronously.
}

function refreshNetworkInfiltration() {
    // Refreshes the UI.
    displayPointerText();
    grid.ctx.clearRect(0, 0, grid.dimensions.gridWidth, grid.dimensions.gridHeight);
    drawConnectionsBetweenCells();
    drawCellBase();
    drawCellItems();
    updateICEHunt();
    updateICEAnimation();
    drawPointerOnCell();
}

function updateICEAnimation() {
    grid.ICEAI.animation.tickCount < 1000 ? grid.ICEAI.animation.tickCount++ : grid.ICEAI.animation.tickCount = 0;
    //grid.ICEAI.animation.tickCount++;
}

/*
function gridDimensions() {
    // Creates empty 2d grid based on how many cells can fit inside.
    const cellNumX = grid.dimensions.cellNumX;
    const cellNumY = grid.dimensions.cellNumY;
    //grid.coords.cellCoords = new Array(cellNumY);
    grid.maps.ICEPresence = new Array(cellNumY);
    for (let i = 0; i < cellNumX; i++) {
        //grid.coords.cellCoords[i] = [];
        grid.maps.ICEPresence[i] = [];
    }
}
*/

function populateGrid() {
    // Creates coords for individual cells.
    // Coords are based off of dimensions and padding of cells.
    let gridX = 0;
    let gridY = 0;
    for (let y = 1; y < grid.dimensions.gridHeight; y += grid.dimensions.cellHeight) {
        for (let x = 1; x < grid.dimensions.gridWidth; x += grid.dimensions.cellWidth) {
            insertCellCoord(x, y, gridX, gridY);
            //insertICEStatus(x, y, gridX, gridY);
            gridX++;
        }
        gridY++;
        gridX = 0;
    }
}

function insertCellCoord(coordX, coordY, cellX, cellY) {
    grid.maps.items[cellY][cellX].dimensions = {
        x: coordX,
        y: coordY
    };
}

function insertICEStatus(x, y) {
    /*
    grid.maps.ICEPresence[cellY][cellX] = {
        hasICE: false,
        offsetAnimation: (10 - cellX) + (10 - cellY)
    };
    */
    return {
        hasICE: false,
        pathIntact: true,
        animationOffset: (grid.dimensions.cellNumX - x) + (grid.dimensions.cellNumY - y)
    }

}

function populateItemMap() {
    for (let y = grid.maps.items.length - 1; y >= 0; y--) {
        for (let x = grid.maps.items[y].length - 1; x >= 0; x--) {
            const itemType = grid.maps.items[y][x];
            //const itemType = grid.itemType[gridCoord]

            grid.maps.items[y][x] = new cell();
            grid.maps.items[y][x].create(getItemData(itemType));

            grid.maps.items[y][x].coords.x = x;
            grid.maps.items[y][x].coords.y = y;

            //grid.maps.items[y][x].dimensions.x = grid.coords.cellCoords[y][x].x;
            //grid.maps.items[y][x].dimensions.y = grid.coords.cellCoords[y][x].y;

            grid.maps.items[y][x].access = grid.maps.playerAccess[y][x];

            grid.maps.items[y][x].ICE = insertICEStatus(x, y);
        }
    }
}


function renderLineBetweenCells(startXC, startYC, endXC, endYC, color) {
    // Draws a line between two points.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;

    const Xoffset = (grid.dimensions.cellWidth - grid.dimensions.cellPadding) / 2;
    const Yoffset = (grid.dimensions.cellHeight - grid.dimensions.cellPadding) / 2;

    //const startX = grid.coords.cellCoords[startYC][startXC].x + Xoffset;
    const startX = grid.maps.items[startYC][startXC].dimensions.x + Xoffset;
    const startY = grid.maps.items[startYC][startXC].dimensions.y + Xoffset;
    //const startY = grid.coords.cellCoords[startYC][startXC].y + Yoffset;

    const endX = grid.maps.items[endYC][endXC].dimensions.x + Xoffset;
    const endY = grid.maps.items[endYC][endXC].dimensions.y + Yoffset;
    //const endX = grid.coords.cellCoords[endYC][endXC].x + Xoffset;
    //const endY = grid.coords.cellCoords[endYC][endXC].y + Yoffset;

    grid.ctx.beginPath();
    grid.ctx.moveTo(startX, startY);
    grid.ctx.lineTo(endX, endY);
    grid.ctx.stroke();
}

function clearCellRendering(x, y) {
    // Hides a grid square.
    const hideX = grid.coords.cellCoords[y][x].x;
    const hideY = grid.coords.cellCoords[y][x].y;
    const cellWidth = grid.dimensions.cellWidth;
    const cellHeight = grid.dimensions.cellHeight;
    grid.ctx.clearRect(hideX, hideY, cellWidth, cellHeight);
}

function drawCellBase() {
    // Draws the grid based on coordinates.
    for (let y = grid.maps.items.length - 1; y >= 0; y--) {
        for (let x = grid.maps.items[y].length - 1; x >= 0; x--) {
            //renderCellOutline(x, y, theme.colorTheme[theme.currentTheme].bodyColor);
            grid.maps.items[y][x].renderCellOutline(theme.colorTheme[theme.currentTheme].bodyColor);
        }
    }
}

function drawCellItems() {
    // Fills grid in with objects from the .maps.items.
    for (let y = grid.maps.items.length - 1; y >= 0; y--) {
        for (let x = grid.maps.items[y].length - 1; x >= 0; x--) {
            //const gridCoord = grid.maps.items[y][x].id;
            grid.maps.items[y][x].renderCell();
        }
    }
}

function drawPointerOnCell() {
    // Display white outline around cell where pointer is.
    //renderCellOutline(grid.pointer.x, grid.pointer.y, grid.colors.pointer);
    //grid.maps.items[grid.pointer.y][grid.pointer.x].renderCellOutline();
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
    const objectType = grid.maps.items[grid.pointer.y][grid.pointer.x].id;
    // Creates an array of strings.
    // If a string does not apply to the specific object it will be undefined.
    /*
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
    */
    return 'temp';
}

function getPointerTextName(objectType) {
    const text = "<span style=color:" + theme.colorTheme[theme.currentTheme].importantColor + ">" + grid.itemType[objectType].name + "</span>";
    return text;
    //theme.colorTheme[theme.currentTheme].importantColor
}

function getPointerTextDesc(objectType) {
    return grid.itemType[objectType].description;
}

function getPointerTextRequirements(objectType) {
    if (!checkPointerOverAccessedCell()) {
        return grid.itemType[objectType].requirements;
    }
}

function getPointerTextAccess() {
    return checkPointerOverAccessedCell() ? "You have <span style='color:green'>access</span> to this" : "You do not have <span style='color:red'>access</span> to this";
}

function getPointerTextICE() {
    const x = grid.pointer.x;
    const y = grid.pointer.y;
    //return grid.maps.ICEPresence[y][x].hasICE ? "<span style='color:red'>ICE</span> is present here" : undefined;
    return grid.maps.items[y][x].ICE.hasICE ? "<span style='color:red'>ICE</span> is present here" : undefined;
}

function getPointerTextServerReward(objectType) {
    // If pointer is over unaccessed server.
    if (objectType === 5 && !checkPointerOverAccessedCell()) {
        let amount = formatBytes(calculateDataReward());
        amount = "<span class='important'>" + amount + "</span>";
        return "Passive probing suggests server contains " + amount + " worth of data";
    }
}

function drawConnectionsBetweenCells() {
    // Draws horizontal lines from maps.connections.
    for (let y = grid.maps.items.length - 1; y >= 0; y--) {
        for (let x = grid.maps.items[y].length - 1; x >= 0; x--) {
            drawHorizontalLines(x, y);
            drawVerticalLines(x, y);
        }
    }
}

function drawHorizontalLines(x, y) {
    if (checkForXLineNeighbour(x, y)) {
        // Two adjacent cells that have access will have a green line between them.
        if (checkCellIsAccessed(x, y) && checkAccessRight(x, y)) {
            renderLineBetweenCells(x, y, x + 1, y, grid.colors.playerAccess);
        }
        // If one or both do not have access, the default color will be applied.
        else {
            renderLineBetweenCells(x, y, x + 1, y, theme.colorTheme[theme.currentTheme].importantColor);
        }
        // Covers lines that overlap cells.
        //renderCellFill(x, y, "black");
        //renderCellFill(x + 1, y, "black");
        grid.maps.items[y][x].renderCellFill("black");
        grid.maps.items[y][x + 1].renderCellFill("black");

    }
}

function drawVerticalLines(x, y) {
    if (checkForYLineNeighbour(x, y)) {
        // Two adjacent cells that have access will have a green line between them.
        if (checkCellIsAccessed(x, y) && checkAccessBelow(x, y)) {
            renderLineBetweenCells(x, y, x, y + 1, grid.colors.playerAccess);
        }
        // If one or both do not have access, the default color will be applied.
        else {
            renderLineBetweenCells(x, y, x, y + 1, theme.colorTheme[theme.currentTheme].importantColor);
        }
        // Covers lines that overlap cells.
        //renderCellFill(x, y, "black");
        //renderCellFill(x, y + 1, "black");
        grid.maps.items[y][x].renderCellFill("black");
        grid.maps.items[y + 1][x].renderCellFill("black");
    }
}

function checkForXLineNeighbour(x, y) {
    // Checks if there is a 1 to the right of x on the lineMap.
    // If x is on a rightmost cell, nothing can be to the right of it so return false.
    return x === grid.maps.connections[y].length - 1 ? false : grid.maps.connections[y][x] === 1 && grid.maps.connections[y][x + 1] === 1;
}

function checkForYLineNeighbour(x, y) {
    // Checks if there is a 1 below y in the lineMap.
    return y === grid.maps.connections[x].length - 1 ? false : grid.maps.connections[y][x] === 1 && grid.maps.connections[y + 1][x] === 1;
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
        36: () => {movePointerLeft(); movePointerUp();}, // Home
        103: () => {movePointerLeft();movePointerUp();}, // Numpad 7
        // Move diagonally right/up.
        33: () => {movePointerRight();movePointerUp();}, // Page Up
        105: () => { movePointerRight(); movePointerUp();}, // Numpad 9
        // Move diagonally left/down.
        35: () => {movePointerLeft();movePointerDown();}, // End
        97: () => {movePointerLeft();movePointerDown();}, // Numpad 1
        // Move diagonally right/down.
        34: () => {movePointerRight();movePointerDown();}, // Page Down
        99: () => {movePointerRight();movePointerDown();}, // Numpad 3
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
    if (grid.pointer.y !== 0) {
        grid.pointer.y--;
    }
}

function movePointerDown() {
    // If pointer is not at bottom, move pointer down.
    if (grid.pointer.y !== grid.maps.items.length - 1) {
        grid.pointer.y++;
    }
}

function movePointerLeft() {
    // If pointer is not leftmost. move pointer left.
    if (grid.pointer.x !== 0) {
        grid.pointer.x--;
    }
}

function movePointerRight() {
    // If pointer is not rightmost, move pointer right.
    if (grid.pointer.x !== grid.maps.items[0].length - 1) {
        grid.pointer.x++;
    }
}

function playerAction() {
    grid.maps.items[grid.pointer.y][grid.pointer.x].action();
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

function checkPointerOverLine() {
    // Checks if the pointer is over a line.
    return grid.maps.connections[grid.pointer.y][grid.pointer.x] === 1;
}

function checkPointerOverAccessedCell() {
    // If the pointer is currently on an accessed area.
    return checkCellIsAccessed(grid.pointer.x, grid.pointer.y);
}

function canEnableAccessAtPointer() {
    // If cell can be changed from unaccessed to accessed.
    return checkPointerOverLine() && checkPointerNextToAccessArea() && !checkPointerOverAccessedCell();
}

function enableAccessOnCell(x, y) {
    //grid.maps.playerAccess[y][x] = 1;
    grid.maps.items[y][x].access = 1;
    grid.maps.ICEConnections[y][x] = 0;
    //grid.maps.ICEPresence[y][x].hasICE = false;
    grid.maps.items[y][x].ICE.hasICE = false;
}

function checkCellIsAccessed(x, y) {
    return grid.maps.items[y][x].access === 1;
}

function checkPointerNextToAccessArea() {
    // Checks if pointer is next to an area that is accessed.
    const x = grid.pointer.x;
    const y = grid.pointer.y;
    return (checkAccessAbove(x, y) || checkAccessBelow(x, y) || checkAccessLeft(x, y) || checkAccessRight(x, y));
}

function checkAccessAbove(x, y) {
    // If y is 0 then the cell is at the top of the grid so nothing can be above it.
    // Else check if the cell above (y-1) has a value of 1 (not truthy, but specifically 1).
    return y === 0 ? false : checkCellIsAccessed(x, y - 1);
}

function checkAccessBelow(x, y) {
    //return y === grid.maps.playerAccess.length - 1 ? false : checkCellIsAccessed(x, y+1);
    return y === grid.maps.items.length - 1 ? false : checkCellIsAccessed(x, y + 1);
}

function checkAccessLeft(x, y) {
    return x === 0 ? false : checkCellIsAccessed(x - 1, y);
}

function checkAccessRight(x, y) {
    //return x === grid.maps.playerAccess[y].length - 1 ? false : checkCellIsAccessed(x+1, y);
    return x === grid.maps.items[y].length - 1 ? false : checkCellIsAccessed(x + 1, y);
}

function ICEHunt() {
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
    es.setGrid(grid.maps.ICEConnections);
    es.setAcceptableTiles([1]);
    es.findPath(9, 9, grid.ICEAI.targets[i].x, grid.ICEAI.targets[i].y, function(path) {
        if (path === null) {
            console.log("No possible path for ICE.");
        }
        else {
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
    // when calculateICEHuntPath() finds a path it will be added here.
    grid.ICEAI.targets[i].path = path;
}

function getListOfServers() {
    // Populates an array of coordinates where servers exist.
    // These will be used as targets for ICE.
    for (let y = 0; y < grid.maps.items.length; y++) {
        for (let x = 0; x < grid.maps.items[y].length; x++) {
            detectServer(x, y);
        }
    }

    function detectServer(x, y) {
        if (grid.maps.items[y][x].id === 5) { // The ID for servers is 5
            grid.ICEAI.targets.push({
                x: x,
                y: y
            });
        }
    }
}

function increaseICEHuntSteps() {
    // ICE will move one step every time the player takes an action.
    for (let i = grid.ICEAI.targets.length - 1; i >= 0; i--) {
        // If it is a new target, it will not have any steps.
        if (typeof grid.ICEAI.targets[i].stepsTaken === "undefined") {
            grid.ICEAI.targets[i].stepsTaken = 0;
        }
        // Increase steps until end of path is reached.
        else if (grid.ICEAI.targets[i].stepsTaken < grid.ICEAI.targets[i].path.length) {
            grid.ICEAI.targets[i].stepsTaken++;
        }
    }
}

function updateICEHunt() {
    // This is a clusterfuck.
    // There is a list of targets, each target may have a list of steps to reach the target (depending on async pathfinding)
    if (grid.ICEAI.isHunting) { // If ICE has been triggered.
        for (let tarI = grid.ICEAI.targets.length - 1; tarI >= 0; tarI--) { // Loop through ICE targets.
            if (grid.ICEAI.targets[tarI].path) { // If a path has been found to reach the target.
                for (let stepI = 0; stepI < grid.ICEAI.targets[tarI].stepsTaken; stepI++) { // Loop through the steps in the path.
                    setICEAILocation(tarI, stepI); // Update grid with the current locations of ICE.
                }
            }
        }
    }
}

function setICEAILocation(target, step) {
    if (grid.ICEAI.targets[target].path[step]) {
        const x = grid.ICEAI.targets[target].path[step].x;
        const y = grid.ICEAI.targets[target].path[step].y;

        updateCellSteps(x, y, step);

        if (grid.maps.items[y][x].access === 0) {
            // If the player has not accessed this area, ICE may move here.
            //grid.maps.ICEPresence[y][x].hasICE = true;
            grid.maps.items[y][x].ICE.hasICE = true;
            //grid.maps.ICEPresence[y][x].pathIntact = true;
            grid.maps.items[y][x].ICE.pathIntact = true;
        }
        else {
            // If the player has accessed this area, ICE may not move here.
            grid.maps.items[y][x].ICE.hasICE = false;

            // Remove all steps after this one since ICE cannot progress further.
            severPath(target, step);
            grid.ICEAI.targets[target].path.splice(step);
        }
    }
}

function severPath(target, step) {
    for (var i = grid.ICEAI.targets[target].path.length - 1; i >= step; i--) {
        const x = grid.ICEAI.targets[target].path[i].x;
        const y = grid.ICEAI.targets[target].path[i].y;
        //grid.maps.ICEPresence[y][x].pathIntact = false;
        grid.maps.items[y][x].ICE.pathIntact = false;
    }
}

function updateCellSteps(x, y, step) {
    // So each cell on the ICE path knows how many steps away from the node it is.
    // Used for animating pulses.
    //grid.maps.ICEPresence[y][x].steps = step;
    grid.maps.items[y][x].ICE.steps = step;
}