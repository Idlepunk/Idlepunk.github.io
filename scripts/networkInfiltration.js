// Idlepunk by Asher is licensed under CC BY-NC-SA 4.0 - https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
/*jshint esversion: 6 */
/*jshint eqeqeq: true */
/*jshint supernew: true */
/*jshint multistr: true */

/*
TODO:
-Work out the difference between rendering and drawing.
-More prototypes.
-Refactor ICE.
*/

function netWorkInfiltrationConstructor() {
    window.grid = new function() {
        this.DOM = {
            selectorDetail: "selectorName",
            selectorDescription: "selectorDescription",
            selectorCost: "selectorCost",
            selectorAccess: "selectorAccess",
            selectorICE: "selectorICE"
        };
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
            ICEMain: 'red',
            ICEAlt: '#FF5900',
            ICEDead: '#AD4D4D',
            selector: 'white'
        };
        // Sets the dimensions of cells
        this.dimensions.cellWidth = this.dimensions.gridWidth / this.dimensions.cellNumX;
        this.dimensions.cellHeight = this.dimensions.gridHeight / this.dimensions.cellNumY;
        // Sets the dimensions in the canvas.
        this.ctx.canvas.width = this.dimensions.gridWidth;
        this.ctx.canvas.height = this.dimensions.gridHeight;
        this.selector = {
            x: 0,
            y: 0
        };
        this.ICEAI = {
            targets: [],
            isHunting: false,
            animation: {
                startEvery: 5,
                tickCount: 0
            }
        };
        // The grid is made up of cells.
        this.cells = [[]];
        this.levelBuilder = {
            // The game level is made by drawing these 3 arrays.
            // All the arrays will get merged into the cells array.

            // This determines what items are in what Cell:
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
            // This determines where connections should appear running through the grid.
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
            // This determines where the player has access to at the start of the game.
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
        this.levelBuilder.ICEConnections = this.levelBuilder.connections.map(function(arr) {return arr.slice();});
    };
}

class Cell {
    constructor(x, y){
        this.coords = {x: x, y: y};
        this.dimensions = {};
        this.access = grid.levelBuilder.playerAccess[y][x];
        this.connection = grid.levelBuilder.connections[y][x];
        this.setDefaultICEStatus();
    }
}   

class Switch extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "Switch",
            id: 0,
            description: "There is nothing of import here",
            costMultiplier: 1,
            fillColor: false
        });
    }
}

class EntryNode extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "Entry Node",
            id: 1,
            description: 0,
            costMultiplier: false,
            fillColor: grid.colors.playerAccess
        });
    }
}

class NodeCore extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "Node Core",
            id: 2,
            description: "Contains large quantities of sensitive information",
            costMultiplier: 5,
            fillColor: "#283747"
        });
    }
}

class Firewall extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "Firewall",
            id: 3,
            description: "Prevents access",
            costMultiplier: 3,
            fillColor: "grey"
        });
    }
}

class ICE extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "ICE",
            id: 4,
            description: "Attacks Intruders",
            costMultiplier: 0,
            fillColor: "#E74C3C"
        });
    }
}

class Server extends Cell {
    constructor(x, y) {
        super(x, y);
        this.createSpecificItem({
            name: "Server",
            id: 5,
            description: "Contains information",
            costMultiplier: 2,
            fillColor: "#2980B9"
        });
    }
}

Cell.prototype.setDefaultICEStatus = function () {
    this.ICE = {
        hasICE: false,
        pathIntact: true,
        animationOffset: (grid.dimensions.cellNumX - this.coords.x) + (grid.dimensions.cellNumY - this.coords.y),
        connection: grid.levelBuilder.ICEConnections[this.coords.y][this.coords.x]
    };
};

Cell.prototype.createSpecificItem = function(e) {
    // TODO.
    this.name = e.name;
    this.id = e.id;
    this.description = e.description;
    this.costMultiplier = e.costMultiplier;
    this.fillColor = e.fillColor;
};

Cell.prototype.renderCell = function() {
    if (this.fillColor){
        this.drawCellFill();
    }
    this.renderPlayerAccess();
    this.renderICE();
    this.renderSelector();
};

Cell.prototype.renderPlayerAccess = function(x, y) {
    if (this.access) {
        this.drawCellOutline(grid.colors.playerAccess);
    }
};

Cell.prototype.renderICE = function() {
    if (this.ICE.hasICE) {
        if (!this.ICE.pathIntact) {
            // If the path is broken, display the dead ICE color.
            this.drawCellInternalOutline(grid.colors.ICEDead);
        }
        else {
            // Else pick a color based on animation.
            this.drawCellInternalOutline(this.getICEColorFromTick());
        }
    }
};

Cell.prototype.getICEColorFromTick= function() {
    // Alternate colors are displayed based on the tick count and how far away the Cell is from the exit point.
    const shouldAltColorRender = (grid.ICEAI.animation.tickCount - this.ICE.steps) % grid.ICEAI.animation.startEvery === 0;
    return shouldAltColorRender ? grid.colors.ICEAlt : grid.colors.ICEMain;
};

Cell.prototype.renderSelector = function() {
    // If the selector is over this Cell, display a white outline over it.
    if (grid.selector.y === this.coords.y && grid.selector.x === this.coords.x) {
        this.drawCellOutline("white");
        this.renderSelectorText();
    }
};

Cell.prototype.renderSelectorText = function() {
    // TODO.
    /*
    HTMLEditor(grid.DOM.selectorDetail,      this.name);
    HTMLEditor(grid.DOM.selectorDescription, this.description);
    HTMLEditor(grid.DOM.selectorCost,        this.getCostToAccess());
    HTMLEditor(grid.DOM.selectorAccess,      this.access);
    HTMLEditor(grid.DOM.selectorICE,         this.ICE.hasICE);
    */
};

Cell.prototype.drawCellFill = function(color) {
    // Draws a full color square.
    grid.ctx.lineWidth = "4";
    grid.ctx.fillStyle = color || this.fillColor;

    const drawX = this.dimensions.x - 1.5;
    const drawY = this.dimensions.y - 1.5;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding + 3;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding + 3;

    grid.ctx.fillRect(drawX, drawY, cellWidth, cellHeight);
};

Cell.prototype.drawCellOutline = function(color) {
    // Draws the outline of a square.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color || this.fillColor;

    const drawX = this.dimensions.x;
    const drawY = this.dimensions.y;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding;

    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
};

Cell.prototype.drawCellInternalOutline = function(color) {
    // Draws the outline of a square with some negative padding.
    const bonusPad = 3;
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color || this.color;

    const drawX = this.dimensions.x + bonusPad;
    const drawY = this.dimensions.y + bonusPad;

    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding - (bonusPad * 2);
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding - (bonusPad * 2);

    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
};

Cell.prototype.takeAction = function() {
    if (canEnableAccessAtSelector() && this.canAffordAccess()) {
        subtractData(this.getCostToAccess());
        const x = this.coords.x;
        const y = this.coords.y;
        this.enableAccessOnCell();
        // If this is a server.
        if (this.id === 4) {
            grid.ICEAI.isHunting = true;
        }
        ICEHunt();
    }
};

Cell.prototype.enableAccessOnCell = function() {
    // Possible glitch with ICE AI here.
    this.access = true;
    grid.cells[this.coords.y][this.coords.x].ICE.connection = false;
    this.ICE.hasICE = false;
};

Cell.prototype.isAccessed = function() {
    // Yeah... this is fairly pointless...
    // TODO.
    return this.access;
};

Cell.prototype.canAffordAccess = function() {
    return (gameData.dataHacked >= this.getCostToAccess());
};

Cell.prototype.getCostToAccess = function() {
    return this.costMultiplier * itemList[getBestUnlockedItem()].itemData.baseCost;
};

function startHackGame() {
    // First time run.

    // Converts the easy to read/make binary arrays to easy to process booleans.
    convertBinaryMapToBooleanMap(grid.levelBuilder.playerAccess);
    convertBinaryMapToBooleanMap(grid.levelBuilder.connections);
    convertBinaryMapToBooleanMap(grid.levelBuilder.ICEConnections);

    createCellMap();
    populateCellMap();

    createDimensionalCoordianates();

    refreshNetworkInfiltration();

    getListOfServers();
    ICEHunt(); // Happens asynchronously.
}

function refreshNetworkInfiltration() {
    // Refreshes the UI without changing the game state.
    clearGrid();
    renderCellConnections();
    renderCellBase();
    renderCellItems();
    updateICEHunt();
    updateICEAnimation();
}

function updateICEAnimation() {
    grid.ICEAI.animation.tickCount++;
}

function clearGrid() {
    grid.ctx.clearRect(0, 0, grid.dimensions.gridWidth, grid.dimensions.gridHeight); 
}

function convertBinaryMapToBooleanMap(grid) {
    // Converts an array of 1s & 0s to an array of trues & falses.
    for (var y = grid.length - 1; y >= 0; y--) {
        for (var x = grid[y].length - 1; x >= 0; x--) {
            grid[y][x] = grid[y][x] !== 0 ? true : false;
        }
    }
}

function createDimensionalCoordianates() {
    // Creates top right corner coords for cells.
    // Coords are based off of dimensions and padding of cells.
    let cellX = 0;
    let cellY = 0;
    for (let y = 1; y < grid.dimensions.gridHeight; y += grid.dimensions.cellHeight) {
        for (let x = 1; x < grid.dimensions.gridWidth; x += grid.dimensions.cellWidth) {
            insertCellCoord(x, y, cellX, cellY);
            cellX++;
        }
        cellY++;
        cellX = 0;
    }
    console.log(cellX, cellY)
}

function insertCellCoord(dimensionX, dimensionY, cellX, cellY) {
    grid.cells[cellY][cellX].dimensions = {
        x: dimensionX,
        y: dimensionY
    };
}

function createCellMap() {
    // Creates empty 2d grid based on how many cells can fit inside.
    const cellNumX = grid.dimensions.cellNumX;
    const cellNumY = grid.dimensions.cellNumY;
    grid.cells = new Array(cellNumY);
    for (let i = 0; i < cellNumX; i++) {
        grid.cells[i] = new Array(cellNumX);
    }
}

function populateCellMap() {
    // Populates the Cell map with Cell data.
    for (let y = grid.levelBuilder.items.length - 1; y >= 0; y--) {
        for (let x = grid.levelBuilder.items[y].length - 1; x >= 0; x--) {
            createCell(x, y);
        }
    }
}

function createCell(x, y) {
    // Creates an item Cell based on what item is in the level builder items array.
    const itemID = grid.levelBuilder.items[y][x];
    const itemClass = getItemClass(itemID);
    grid.cells[y][x] = new itemClass(x, y);
}

function getItemClass(id) {
    return itemTypes = {
        0: Switch,
        1: EntryNode,
        2: NodeCore,
        3: Firewall,
        4: ICE,
        5: Server
    }[id];
}

function renderLineBetweenCells(startCellX, startCellY, endCellX, endCellY, color) {
    // Draws a line between two cells.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;


    // Offset is so the lines only touch the cells, not enter them.
    const offsetX = startCellX !== endCellX ? ((grid.dimensions.cellWidth / 2) - 2) / 2 : null;
    const offsetY = startCellY !== endCellY ? ((grid.dimensions.cellHeight / 2) - 2) / 2 : null;

    const paddingX = (grid.dimensions.cellWidth - grid.dimensions.cellPadding) / 2;
    const paddingY = (grid.dimensions.cellHeight - grid.dimensions.cellPadding) / 2;

    const startX = grid.cells[startCellY][startCellX].dimensions.x + paddingX + offsetX;
    const startY = grid.cells[startCellY][startCellX].dimensions.y + paddingY + offsetY;

    const endX = grid.cells[endCellY][endCellX].dimensions.x + paddingX - offsetX;
    const endY = grid.cells[endCellY][endCellX].dimensions.y + paddingY - offsetY;

    grid.ctx.beginPath();
    grid.ctx.moveTo(startX, startY);
    grid.ctx.lineTo(endX, endY);
    grid.ctx.stroke();
}

function isCellBelowOtherCell(firstCellX) {

}

function renderCellBase() {
    // Draws the grid based on coordinates.
    for (let y = grid.cells.length - 1; y >= 0; y--) {
        for (let x = grid.cells[y].length - 1; x >= 0; x--) {
            grid.cells[y][x].drawCellOutline(theme.colorTheme[theme.currentTheme].bodyColor);
        }
    }
}

function renderCellItems() {
    // Fills grid in with objects from the .maps.cells.
    for (let y = grid.cells.length - 1; y >= 0; y--) {
        for (let x = grid.cells[y].length - 1; x >= 0; x--) {
            grid.cells[y][x].renderCell();
        }
    }
}

function renderCellConnections() {
    // Cell connections are the line running between cells, indicating where the player and ICE can 'travel'.
    for (let y = grid.cells.length - 1; y >= 0; y--) {
        for (let x = grid.cells[y].length - 1; x >= 0; x--) {
            renderLinesWhereConnectionsExist(x, y);
        }
    }
}

function renderLinesWhereConnectionsExist(x, y) {
    // Starts in the bottom right of the grid.
    if (connectionRightOfCell(x, y)) {
        renderLinesByAccess(x, y, x + 1, y);
    }
    if (connectionAboveCell(x, y)) {
        renderLinesByAccess(x, y, x, y + 1);
    }
}

function renderLinesByAccess(startX, startY, endX, endY) {
    // Renders a line between two cells, the color is based on access status.
    if (grid.cells[startY][startX].isAccessed() && grid.cells[endY][endX].isAccessed()) {
        renderLineBetweenCells(startX, startY, endX, endY ,grid.colors.playerAccess);
    }
    else {
        renderLineBetweenCells(startX, startY, endX, endY, theme.colorTheme[theme.currentTheme].importantColor);
    }
}

function connectionRightOfCell(x, y) {
    // Checks if both the Cell at the provided coordinates and the one to the right of it are connection cells.
    return x === grid.cells[y].length - 1 ? false : grid.cells[y][x].connection && grid.cells[y][x + 1].connection;
}

function connectionAboveCell(x, y) {
    // Checks if both the Cell at the provided coordinates and the one above it are connection cells.
    return y === grid.cells[x].length - 1 ? false : grid.cells[y][x].connection && grid.cells[y + 1][x].connection;
}

document.onkeydown = function(e) {
    // Either moves the selector to another Cell or takes an action on the Cell.
    // Different keys call different functions.
    // foo = {bar: () => baz()} will not call baz() when foo is initialized, baz can be called through foo().
    const actionFromInput = {
        // Move Left.
        37: () => moveSelectorLeft(), // Left Arrow
        65: () => moveSelectorLeft(), // A
        100: () => moveSelectorLeft(), // Numpad 4
        // MoveRight.
        39: () => moveSelectorRight(), // Right Arrow
        68: () => moveSelectorRight(), // D
        102: () => moveSelectorRight(), // Numpad 6
        // Move Down.
        40: () => moveSelectorDown(), // Down Arrow
        83: () => moveSelectorDown(), // S
        98: () => moveSelectorDown(), // Numpad 2
        // Move Up.
        87: () => moveSelectorUp(), // Up arrow
        38: () => moveSelectorUp(), // W
        104: () => moveSelectorUp(), // Numpad 8
        // Move diagonally left/up.
        36: () => {moveSelectorLeft(); moveSelectorUp();}, // Home
        103: () => {moveSelectorLeft();moveSelectorUp();}, // Numpad 7
        // Move diagonally right/up.
        33: () => {moveSelectorRight();moveSelectorUp();}, // Page Up
        105: () => { moveSelectorRight(); moveSelectorUp();}, // Numpad 9
        // Move diagonally left/down.
        35: () => {moveSelectorLeft();moveSelectorDown();}, // End
        97: () => {moveSelectorLeft();moveSelectorDown();}, // Numpad 1
        // Move diagonally right/down.
        34: () => {moveSelectorRight();moveSelectorDown();}, // Page Down
        99: () => {moveSelectorRight();moveSelectorDown();}, // Numpad 3
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
    }
    else {
        console.log(e.key + " is not bound to anything.");
    }
};

function moveSelectorUp() {
    // If the selector is not at the top, move up, if it is at the top, move to bottom.
    grid.selector.y = grid.selector.y !== 0 ? grid.selector.y - 1: grid.cells.length - 1;
}

function moveSelectorDown() {
    // If the selector is not at the bottom, move down, if it is at the bottom, move to top.
    grid.selector.y = grid.selector.y !== grid.cells.length - 1 ? grid.selector.y + 1 : grid.selector.y = 0;
}

function moveSelectorLeft() {
    // If the selector is not leftmost, move left, if it is leftmost, move rightmost.
    grid.selector.x = grid.selector.x !== 0 ? grid.selector.x - 1 : grid.cells.length - 1;
}

function moveSelectorRight() {
    // If the selector is not rightmost, move right, if it is rightmost, move leftmost.
    grid.selector.x = grid.selector.x !== grid.cells.length - 1 ? grid.selector.x + 1 : grid.selector.x = 0;
}

function playerAction() {
    // Makes the Cell that the selector is over take an action.
    grid.cells[grid.selector.y][grid.selector.x].takeAction();
}

function giveDataReward() {
    // TODO.
    const rewardAmount = calculateDataReward();
    addData(rewardAmount);
}

function calculateDataReward() {
    // TODO.
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

function isSelectorOverConnectionCell() {
    return grid.cells[grid.selector.y][grid.selector.x].connection;
}

function isSelectorOverAccessedCell() {
    return grid.cells[grid.selector.y][grid.selector.x].isAccessed();
}

function canEnableAccessAtSelector() {
    // If Cell can be changed from unaccessed to accessed.
    // It has to be:
    // 1. Over a Cell that is connected.
    // 2. Adjacent to a Cell that the player has already accessed.
    // 3. Over a Cell that the player has not already accessed.
    return isSelectorOverConnectionCell() && isSelectorAdjacentToAccessedCell() && !isSelectorOverAccessedCell();
}

function isSelectorAdjacentToAccessedCell() {
    const x = grid.selector.x;
    const y = grid.selector.y;
    return (isCellAboveAccessed(x, y) || isCellBelowAccessed(x, y) || isCellToLeftAccessed(x, y) || isCellToRightAccessed(x, y));
}

function isCellAboveAccessed(x, y) {
    return y === 0 ? false : grid.cells[y - 1][x].isAccessed();
}

function isCellBelowAccessed(x, y) {
    return y === grid.cells.length - 1 ? false : grid.cells[y + 1][x].isAccessed();
}

function isCellToLeftAccessed(x, y) {
    return x === 0 ? false : grid.cells[y][x - 1].isAccessed();
}

function isCellToRightAccessed(x, y) {
    return x === grid.cells[y].length - 1 ? false : grid.cells[y][x + 1].isAccessed();
}

function ICEHunt() {
    // TODO.
    getPathsForICETargets();
    if (grid.ICEAI.isHunting) {
        increaseICEHuntSteps();
        getPathsForICETargets();
        refreshNetworkInfiltration();
    }
}

function calculateICEHuntPath(i) {
    const es = new EasyStar.js();
    es.setIterationsPerCalculation(1000);
    es.setGrid(grid.levelBuilder.ICEConnections);
    es.setAcceptableTiles([true]);
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
    for (let y = 0; y < grid.cells.length; y++) {
        for (let x = 0; x < grid.cells[y].length; x++) {
            detectServer(x, y);
        }
    }

    function detectServer(x, y) {
        if (grid.cells[y][x].id === 5) { // The ID for servers is 5
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

        if (grid.cells[y][x].access === false) {
            // If the player has not accessed this area, ICE may move here.
            grid.cells[y][x].ICE.hasICE = true;
            grid.cells[y][x].ICE.pathIntact = true;
        }
        else {
            // If the player has accessed this area, ICE may not move here.
            grid.cells[y][x].ICE.hasICE = false;

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
        grid.cells[y][x].ICE.pathIntact = false;
    }
}

function updateCellSteps(x, y, step) {
    // So each Cell on the ICE path knows how many steps away from the node it is.
    // Used for animating pulses.
    grid.cells[y][x].ICE.steps = step;
}

