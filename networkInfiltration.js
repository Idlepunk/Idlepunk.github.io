// Idlepunk by Asher is licensed under CC BY-NC-SA 4.0 - https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
/*jshint esversion: 6 */
/*jshint eqeqeq: true */
/*jshint supernew: true */
/*jshint multistr: true */
let grid = new function() {
    const canvas = document.getElementById("hackGame");
    if (canvas.getContext) {
        this.ctx = canvas.getContext("2d");
        // Base width of lines. 
        this.ctx.lineWidth = "3";
        this.dimensions = {
            // Dimensions of the display area, change in HTML file as well.
            gridHeight: 300,
            gridWidth: 300,

            // Number of cells you want on the grid.
            // Note: Currently maps I made are for 10x10 grids, changing the number of cells will require new maps.
            cellNumX: 10,
            cellNumY: 10,
            cellPadding: 10
        };
        // Sets the dimensions of cells
        this.dimensions.cellWidth = this.dimensions.gridWidth / this.dimensions.cellNumX;
        this.dimensions.cellHeight = this.dimensions.gridHeight / this.dimensions.cellNumY;

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
            ]
        };
        this.playerItems = {
            ICEPick: 30,
            dummyBarrier: 30,
            virtualServer: 30
        };
    }
}();
const gridItem = function(name, description, requirements, fillColor) {
    this.name = name;
    this.description = description;
    this.requirements = requirements;
    this.fillColor = fillColor;
    this.drawGridItem = function(x, y) {
        if (this.fillColor) {
            drawRectFill(x, y, this.fillColor);
        }
        if (grid.maps.accessMap[y][x] === 1) {
            drawRectOutline(x, y, "#00ff00");
        }
    };
};
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
    refresh();
    displayDetailText();
    displayPointer();
}

function refresh() {
    // Refreshes the UI.
    grid.ctx.clearRect(0, 0, grid.dimensions.gridWidth, grid.dimensions.gridHeight);
    drawLineObjects();
    drawGridBase();
    drawGridItems();
    updateItemUI();
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
            grid.coords.cellCoords[i] = new Array();
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

function drawRectFill(x, y, color) {
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

function drawRectOutline(x, y, color) {
    // Draws the outline of a square.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    const drawX = grid.coords.cellCoords[x][y].x;
    const drawY = grid.coords.cellCoords[x][y].y;
    const cellWidth = grid.dimensions.cellWidth - grid.dimensions.cellPadding;
    const cellHeight = grid.dimensions.cellHeight - grid.dimensions.cellPadding;
    grid.ctx.strokeRect(drawX, drawY, cellWidth, cellHeight);
}

function drawLine(startXC, startYC, endXC, endYC, color) {
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

function drawRectClear(x, y) {
    // Hides a grid square.
    const hideX = grid.coords.cellCoords[x][y].x;
    const hideY = grid.coords.cellCoords[x][y].y;
    const cellWidth = grid.dimensions.cellWidth;
    const cellHeight = grid.dimensions.cellHeight;
    grid.ctx.clearRect(hideX, hideY, cellWidth, cellHeight);
}

function updateItemUI() {
    //Updates the displayed number of items.
    HTMLEditor("gridItemICEPick", grid.playerItems.ICEPick);
    HTMLEditor("gridItemDummyBarrier", grid.playerItems.dummyBarrier);
    HTMLEditor("gridItemVirtualServer", grid.playerItems.virtualServer);
}

function drawGridBase() {
    // Draws the grid based on coordinates.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            drawRectOutline(x, y, theme.colorTheme[theme.currentTheme].bodyColor);
        }
    }
}

function drawGridItems() {
    // Fills grid in with objects from the .maps.gridItemMap.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            const gridCoord = grid.maps.gridItemMap[y][x];
            grid.gridItem[gridCoord].drawGridItem(x, y);
        }
    }
}

function displayPointer() {
    // Display white outline around cell where pointer is.
    drawRectOutline(grid.coords.pointerLoc.x, grid.coords.pointerLoc.y, "white");
    // Display tooltip of what the pointer is over.
    displayDetailText();
}

function displayDetailText() {
    // Shows text based on what the pointer is over.

    // Array of messages to display. Each element should be displayed on its own line.
    const displayText = getDetailText();

    // Clears text already present.
    HTMLEditor("hackGameDetailText", "");
    const displayTextLength = displayText.length;
    for (var i = 0; i < displayTextLength; i++) {
        // HTMLEditor() does not support += strings.
        document.getElementById("hackGameDetailText").innerHTML += displayText[i];
        // Inserts hr after every line except the last.
        if (i !== displayTextLength - 1){
        document.getElementById("hackGameDetailText").innerHTML += "<hr class='hr'>";
        }
    }
}

function getDetailText() {
    const objectType = grid.maps.gridItemMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x];
    // Creates an array of strings.
    // If a string does not apply to the specific object it will be undefined.
    let displayText = [];
    displayText.push(detailTextName(objectType));
    displayText.push(detailTextDesc(objectType));
    displayText.push(detailTextAccessStatus());
    displayText.push(detailTextReq(objectType));
    displayText.push(detailTextServerReward(objectType));

    // Removes undefined strings.
    for (var i = displayText.length - 1; i >= 0; i--) {
        if (typeof displayText[i] === "undefined") {
            displayText.splice(i, 1);
        }
    }
    return displayText;
}

function detailTextName(objectType){
    return grid.gridItem[objectType].name;
}

function detailTextDesc(objectType){
    return grid.gridItem[objectType].description;
}

function detailTextReq(objectType) {
    if (!pointerOnAccessArea()) {
        return grid.gridItem[objectType].requirements;
    }
}

function detailTextAccessStatus() {
    return pointerOnAccessArea() ? "You have access to this" : "You do not have access to this";
}

function detailTextServerReward(objectType) {
    // If pointer is over unaccessed server.
    if (objectType === 5 && !pointerOnAccessArea()) {
        let amount = formatBytes(calculatePlayerDataReward());
        amount = "<span class='important'>" + amount + "</span>";
        return "Passive probing suggests server contains " + amount + " worth of data";
    }
}

function drawLineObjects() {
    // Draws between rectangles on grid.
    // Lines are only drawn between two 1s that are touching on grid.maps.lineMap.
    drawXLines();
    drawYLines();
}

function drawXLines() {
    // Draws horizontal lines from maps.lineMap.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            if (checkForXLineNeighbour(x, y)) {
                // Two adjacent cells that have access will have a green line between them.
                if (checkAccessRight(x, y)) {
                    drawLine(x, y, x + 1, y, "#00ff00");
                }
                // If one or both do not have access, the default color will be applied.
                else {
                    drawLine(x, y, x + 1, y, theme.colorTheme[theme.currentTheme].importantColor);
                }
                // Covers lines that overlap cells.
                drawRectFill(x, y, "black");
                drawRectFill(x + 1, y, "black");
            }
        }
    }
}

function drawYLines() {
    // Draws vertical lines from maps.lineMap.
    for (let y = grid.coords.cellCoords.length - 1; y >= 0; y--) {
        for (let x = grid.coords.cellCoords[y].length - 1; x >= 0; x--) {
            if (checkForYLineNeighbour(x, y)) {
                // Two adjacent cells that have access will have a green line between them.
                if (checkAccessBelow(x, y)){
                    drawLine(x, y, x, y + 1, "#00ff00");
                }
                // If one or both do not have access, the default color will be applied.
                else {
                    drawLine(x, y, x, y + 1, theme.colorTheme[theme.currentTheme].importantColor);
                }
                // Covers lines that overlap cells.

                drawRectFill(x, y, "black");
                drawRectFill(x, y + 1, "black");
            }
        }
    }
}

function checkForXLineNeighbour(x, y) {
    // Checks if there is a 1 to the right of x.
    if (x === grid.maps.lineMap[9].length - 1) {
        return false;
    } else {
        return grid.maps.lineMap[y][x] === 1 && grid.maps.lineMap[y][x + 1] === 1;
    }
}

function checkForYLineNeighbour(x, y) {
    // Checks if there is a 1 below y.
    if (y === grid.maps.lineMap.length - 1) {
        return false;
    } else {
        return grid.maps.lineMap[y][x] === 1 && grid.maps.lineMap[y + 1][x] === 1;
    }
}

document.onkeydown = function(e) {
    // Player inputs.
    // Gets input.
    e = e || window.event;
    // Different keys call different functions.
    // foo = {bar: () => baz()} will not call baz() when foo is initialized, baz can be called through foo().
    const actionFromInput = {
        // Move Left.
        37:  () => movePointerLeft(), // Left Arrow
        65:  () => movePointerLeft(), // A
        100: () => movePointerLeft(), // Numpad 4
        // MoveRight.
        39:  () => movePointerRight(), // Right Arrow
        68:  () => movePointerRight(), // D
        102: () => movePointerRight(), // Numpad 6
        // Move Down.
        40:  () => movePointerDown(), // Down Arrow
        83:  () => movePointerDown(), // S
        98:  () => movePointerDown(), // Numpad 2
        // Move Up.
        87:  () => movePointerUp(), // Up arrow
        38:  () => movePointerUp(), // W
        104: () => movePointerUp(), // Numpad 8
        // Move diagonally left/up.
        36:  () => {movePointerLeft(); movePointerUp();}, // Home
        103: () => {movePointerLeft(); movePointerUp();}, // Numpad 7
        // Move diagonally right/up.
        33:  () => {movePointerRight(); movePointerUp();}, // Page Up
        105: () => {movePointerRight(); movePointerUp();}, // Numpad 9
        // Move diagonally left/down.
        35:  () => {movePointerLeft(); movePointerDown();}, // End
        97:  () => {movePointerLeft(); movePointerDown();}, // Numpad 1
        // Move diagonally right/down.
        34:  () => {movePointerRight(); movePointerDown();}, // Page Down
        99:  () => {movePointerRight(); movePointerDown();}, // Numpad 3
        // Action.
        32:  () => playerAction(), // Space bar
        69:  () => playerAction(), // E
        13:  () => playerAction(), // Enter
        107: () => playerAction() // +
    }[e.keyCode]; // Determines what function actionFromInput() should call.
    // If an input keyCode isn't a key in actionFromInput, it will be undefined.
    if (actionFromInput) {
        refresh();
        actionFromInput();
        displayPointer();
    } else {
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
        updateItemUI();
    }
}

function actionOnEmpty() {
    // If the target is:
    // 1. On a line.
    // 2. Adjacent to an accessible location.
    // 3. Not already accessed.
    // 4. The player has an item to use here.
    if (canEnableAccess() && grid.playerItems.virtualServer >= 1) {
        // Remove a virtual server.
        grid.playerItems.virtualServer--;
        // Change this maps.accessMap location from unaccessed to accessed.
        grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] = 1;
    }
}

function actionOnNodeCore() {
    // If the player attempts an action on the end goal.
    // Should be a win condition.
    if (canEnableAccess() && grid.playerItems.ICEPick >= 1 && grid.playerItems.dummyBarrier >= 1 && grid.playerItems.virtualServer >= 1) {
        grid.playerItems.ICEPick--;
        grid.playerItems.dummyBarrier--;
        grid.playerItems.virtualServer--;
        grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] = 1;
    }
}

function actionOnServer() {
    // Should give the player a reward.
    if (canEnableAccess() && grid.playerItems.ICEPick >= 1 && grid.playerItems.dummyBarrier) {
        // Removes items required to access a server.
        grid.playerItems.ICEPick--;
        grid.playerItems.dummyBarrier--;
        // Mark location accessed.
        grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] = 1;
        giveDataReward();
    }
}

function giveDataReward() {
    const rewardAmount = calculatePlayerDataReward();
    addData(rewardAmount);
}

function calculatePlayerDataReward(){
    // At the moment servers reward data equal to the next upgrade cost of the best item the player owns.
    const item = itemList[bestUnlockedItem()];
    return item.upgrade.nextUpgradeCost;
}

function bestUnlockedItem() {
    // Returns the highest tier item that the player has unlocked.
    for (var i = itemList.length - 1; i >= 0; i--) {
        if (itemList[i].itemData.itemCount !== 0) {
            return i;
        }
    }
    return 0;
}

function actionOnFirewall() {
    // Should block the player until they access it.
    if (canEnableAccess() && grid.playerItems.dummyBarrier >= 1) {
        grid.playerItems.dummyBarrier--;
        grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] = 1;
    }
}

function actionOnICE() {
    // Should attack the player until they access it.
    if (canEnableAccess() && grid.playerItems.ICEPick >= 1) {
        grid.playerItems.ICEPick--;
        grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] = 1;
    }
}

function canEnableAccess() {
    // If cell can be changed from unaccessed to accessed.
    return pointerOverLine() && pointerNextToAccessArea() && !pointerOnAccessArea();
}

function pointerOverLine() {
    // Checks if the pointer is over a line.
    return grid.maps.lineMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] === 1;
}

function pointerOnAccessArea() {
    // If the pointer is currently on an accessed area.
    return (grid.maps.accessMap[grid.coords.pointerLoc.y][grid.coords.pointerLoc.x] === 1);
}

function pointerNextToAccessArea() {
    // Checks if pointer is next to an area that is accessed.
    const x = grid.coords.pointerLoc.x;
    const y = grid.coords.pointerLoc.y;
    return (checkAccessAbove(x, y) || checkAccessBelow(x, y) || checkAccessLeft(x, y) || checkAccessRight(x, y));
}

function checkAccessAbove(x, y) {
    // If the cell above is accessed.
    if (y === 0) {
        return false;
    } else {
        return grid.maps.accessMap[y - 1][x] === 1;
    }
}

function checkAccessBelow(x, y) {
    // If the cell below is accessed.
    if (y === grid.maps.accessMap.length - 1) {
        return false;
    } else {
        return grid.maps.accessMap[y + 1][x] === 1;
    }
}

function checkAccessLeft(x, y) {
    // If the cell to the left is accessed.
    if (x === 0) {
        return false;
    } else {
        return grid.maps.accessMap[y][x - 1] === 1;
    }
}

function checkAccessRight(x, y) {
    // If the cell to the right is accessed.
    if (x === grid.maps.accessMap[y].length - 1) {
        return false;
    } else {
        return grid.maps.accessMap[y][x + 1] === 1;
    }
}


function enemyAI() {
    //console.log(grid.maps.lineMap)

    var es = new EasyStar.js();
    es.setGrid(grid.maps.lineMap);
    es.setAcceptableTiles([1]);
    es.findPath(0, 0, 9, 9, function( path ) {
    if (path === null) {
        console.log("Path was not found.");
    } else {
        displayPath(path);
    }
    });
    es.calculate();
    
    function displayPath(path) {
        for (var i = 0; i < path.length; i++) {
            console.log(path[i].x, path[i].y)
        }
    }
}

var EasyStar=function(t){function n(o){if(e[o])return e[o].exports;var i=e[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){var o={},i=e(1),r=e(2),s=e(3);const a=0,u=1;t.exports=o,o.js=function(){var t,n,e,o=1,c=1.4,l=!1,h={},p={},f={},d=!0,y=[],v=Number.MAX_VALUE,g=!1;this.setAcceptableTiles=function(t){t instanceof Array?e=t:!isNaN(parseFloat(t))&&isFinite(t)&&(e=[t])},this.enableSync=function(){l=!0},this.disableSync=function(){l=!1},this.enableDiagonals=function(){g=!0},this.disableDiagonals=function(){g=!1},this.setGrid=function(n){t=n;for(var e=0;e<t.length;e++)for(var o=0;o<t[0].length;o++)p[t[e][o]]||(p[t[e][o]]=1)},this.setTileCost=function(t,n){p[t]=n},this.setAdditionalPointCost=function(t,n,e){f[t+"_"+n]=e},this.removeAdditionalPointCost=function(t,n){delete f[t+"_"+n]},this.removeAllAdditionalPointCosts=function(){f={}},this.setIterationsPerCalculation=function(t){v=t},this.avoidAdditionalPoint=function(t,n){h[t+"_"+n]=1},this.stopAvoidingAdditionalPoint=function(t,n){delete h[t+"_"+n]},this.enableCornerCutting=function(){d=!0},this.disableCornerCutting=function(){d=!1},this.stopAvoidingAllAdditionalPoints=function(){h={}},this.findPath=function(n,r,a,u,c){var h=function(t){l?c(t):setTimeout(function(){c(t)})};if(void 0===e)throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");if(void 0===t)throw new Error("You can't set a path without first calling setGrid() on EasyStar.");if(0>n||0>r||0>a||0>u||n>t[0].length-1||r>t.length-1||a>t[0].length-1||u>t.length-1)throw new Error("Your start or end point is outside the scope of your grid.");if(n===a&&r===u)return void h([]);for(var p=t[u][a],f=!1,d=0;d<e.length;d++)if(p===e[d]){f=!0;break}if(f===!1)return void h(null);var v=new i;v.openList=new s(function(t,n){return t.bestGuessDistance()-n.bestGuessDistance()}),v.isDoneCalculating=!1,v.nodeHash={},v.startX=n,v.startY=r,v.endX=a,v.endY=u,v.callback=h,v.openList.push(A(v,v.startX,v.startY,null,o)),y.push(v)},this.calculate=function(){if(0!==y.length&&void 0!==t&&void 0!==e)for(n=0;v>n;n++){if(0===y.length)return;if(l&&(n=0),0!==y[0].openList.size()){var i=y[0].openList.pop();if(y[0].endX===i.x&&y[0].endY===i.y){y[0].isDoneCalculating=!0;var r=[];r.push({x:i.x,y:i.y});for(var s=i.parent;null!=s;)r.push({x:s.x,y:s.y}),s=s.parent;r.reverse();var u=y[0],h=r;return void u.callback(h)}var p=[];i.list=a,i.y>0&&p.push({instance:y[0],searchNode:i,x:0,y:-1,cost:o*m(i.x,i.y-1)}),i.x<t[0].length-1&&p.push({instance:y[0],searchNode:i,x:1,y:0,cost:o*m(i.x+1,i.y)}),i.y<t.length-1&&p.push({instance:y[0],searchNode:i,x:0,y:1,cost:o*m(i.x,i.y+1)}),i.x>0&&p.push({instance:y[0],searchNode:i,x:-1,y:0,cost:o*m(i.x-1,i.y)}),g&&(i.x>0&&i.y>0&&(d||b(t,e,i.x,i.y-1)&&b(t,e,i.x-1,i.y))&&p.push({instance:y[0],searchNode:i,x:-1,y:-1,cost:c*m(i.x-1,i.y-1)}),i.x<t[0].length-1&&i.y<t.length-1&&(d||b(t,e,i.x,i.y+1)&&b(t,e,i.x+1,i.y))&&p.push({instance:y[0],searchNode:i,x:1,y:1,cost:c*m(i.x+1,i.y+1)}),i.x<t[0].length-1&&i.y>0&&(d||b(t,e,i.x,i.y-1)&&b(t,e,i.x+1,i.y))&&p.push({instance:y[0],searchNode:i,x:1,y:-1,cost:c*m(i.x+1,i.y-1)}),i.x>0&&i.y<t.length-1&&(d||b(t,e,i.x,i.y+1)&&b(t,e,i.x-1,i.y))&&p.push({instance:y[0],searchNode:i,x:-1,y:1,cost:c*m(i.x-1,i.y+1)}));for(var f=!1,A=0;A<p.length;A++)if(x(p[A].instance,p[A].searchNode,p[A].x,p[A].y,p[A].cost),p[A].instance.isDoneCalculating===!0){f=!0;break}f&&y.shift()}else{var u=y[0];u.callback(null),y.shift()}}};var x=function(n,o,i,r,s){var a=o.x+i,c=o.y+r;if(void 0===h[a+"_"+c]&&b(t,e,a,c)){var l=A(n,a,c,o,s);void 0===l.list?(l.list=u,n.openList.push(l)):o.costSoFar+s<l.costSoFar&&(l.costSoFar=o.costSoFar+s,l.parent=o,n.openList.updateItem(l))}},b=function(t,n,e,o){for(var i=0;i<n.length;i++)if(t[o][e]===n[i])return!0;return!1},m=function(n,e){return f[n+"_"+e]||p[t[e][n]]},A=function(t,n,e,o,i){if(void 0!==t.nodeHash[n+"_"+e])return t.nodeHash[n+"_"+e];var s=w(n,e,t.endX,t.endY);if(null!==o)var a=o.costSoFar+i;else a=0;var u=new r(o,n,e,a,s);return t.nodeHash[n+"_"+e]=u,u},w=function(t,n,e,o){if(g){var i=Math.abs(t-e),r=Math.abs(n-o);return r>i?c*i+r:c*r+i}var i=Math.abs(t-e),r=Math.abs(n-o);return i+r}}},function(t,n){t.exports=function(){this.isDoneCalculating=!0,this.pointsToAvoid={},this.startX,this.callback,this.startY,this.endX,this.endY,this.nodeHash={},this.openList}},function(t,n){t.exports=function(t,n,e,o,i){this.parent=t,this.x=n,this.y=e,this.costSoFar=o,this.simpleDistanceToTarget=i,this.bestGuessDistance=function(){return this.costSoFar+this.simpleDistanceToTarget}}},function(t,n,e){t.exports=e(4)},function(t,n,e){var o,i,r;(function(){var e,s,a,u,c,l,h,p,f,d,y,v,g,x,b;a=Math.floor,d=Math.min,s=function(t,n){return n>t?-1:t>n?1:0},f=function(t,n,e,o,i){var r;if(null==e&&(e=0),null==i&&(i=s),0>e)throw new Error("lo must be non-negative");for(null==o&&(o=t.length);o>e;)r=a((e+o)/2),i(n,t[r])<0?o=r:e=r+1;return[].splice.apply(t,[e,e-e].concat(n)),n},l=function(t,n,e){return null==e&&(e=s),t.push(n),x(t,0,t.length-1,e)},c=function(t,n){var e,o;return null==n&&(n=s),e=t.pop(),t.length?(o=t[0],t[0]=e,b(t,0,n)):o=e,o},p=function(t,n,e){var o;return null==e&&(e=s),o=t[0],t[0]=n,b(t,0,e),o},h=function(t,n,e){var o;return null==e&&(e=s),t.length&&e(t[0],n)<0&&(o=[t[0],n],n=o[0],t[0]=o[1],b(t,0,e)),n},u=function(t,n){var e,o,i,r,u,c;for(null==n&&(n=s),r=function(){c=[];for(var n=0,e=a(t.length/2);e>=0?e>n:n>e;e>=0?n++:n--)c.push(n);return c}.apply(this).reverse(),u=[],o=0,i=r.length;i>o;o++)e=r[o],u.push(b(t,e,n));return u},g=function(t,n,e){var o;return null==e&&(e=s),o=t.indexOf(n),-1!==o?(x(t,0,o,e),b(t,o,e)):void 0},y=function(t,n,e){var o,i,r,a,c;if(null==e&&(e=s),i=t.slice(0,n),!i.length)return i;for(u(i,e),c=t.slice(n),r=0,a=c.length;a>r;r++)o=c[r],h(i,o,e);return i.sort(e).reverse()},v=function(t,n,e){var o,i,r,a,l,h,p,y,v,g;if(null==e&&(e=s),10*n<=t.length){if(a=t.slice(0,n).sort(e),!a.length)return a;for(r=a[a.length-1],y=t.slice(n),l=0,p=y.length;p>l;l++)o=y[l],e(o,r)<0&&(f(a,o,0,null,e),a.pop(),r=a[a.length-1]);return a}for(u(t,e),g=[],i=h=0,v=d(n,t.length);v>=0?v>h:h>v;i=v>=0?++h:--h)g.push(c(t,e));return g},x=function(t,n,e,o){var i,r,a;for(null==o&&(o=s),i=t[e];e>n&&(a=e-1>>1,r=t[a],o(i,r)<0);)t[e]=r,e=a;return t[e]=i},b=function(t,n,e){var o,i,r,a,u;for(null==e&&(e=s),i=t.length,u=n,r=t[n],o=2*n+1;i>o;)a=o+1,i>a&&!(e(t[o],t[a])<0)&&(o=a),t[n]=t[o],n=o,o=2*n+1;return t[n]=r,x(t,u,n,e)},e=function(){function t(t){this.cmp=null!=t?t:s,this.nodes=[]}return t.push=l,t.pop=c,t.replace=p,t.pushpop=h,t.heapify=u,t.updateItem=g,t.nlargest=y,t.nsmallest=v,t.prototype.push=function(t){return l(this.nodes,t,this.cmp)},t.prototype.pop=function(){return c(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return p(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return h(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return u(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return g(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var n;return n=new t,n.nodes=this.nodes.slice(0),n},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),function(e,s){return i=[],o=s,r="function"==typeof o?o.apply(n,i):o,!(void 0!==r&&(t.exports=r))}(this,function(){return e})}).call(this)}]);