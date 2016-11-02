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
        // Dimensions of the display area, change in HTML file as well.
        this.gridHeight = 300;
        this.gridWidth = 300;
        // Grid is made up of rectangles, these set their dimensions.
        this.rectHeight = 30;
        this.rectWidth = 30;
        this.rectPadding = 10;
        // Coordinates of rectangles in grid, will be set after number of rectangles is calculated.
        this.coords = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.coordX = 0;
        this.coordY = 0;
        // Starting position of the pointer.
        this.pointerLoc = {
            x: 5,
            y: 0
        };
        // Maps are made by drawing these 3 arrays.
        // The number corresponds to what item will be in that array position.
        // 0 = blank
        // 1 = start
        // 2 = end
        // 3 = firewall
        // 4 = ICE
        // 5 = server
        this.objectMap = [
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
        ];
        // Where lines should appear running through the grid.
        // two 1s must be touching to draw a line between those rectangles.
        this.lineMap = [
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
        ];
        // Where the player has access to.
        this.accessMap = [
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
        ];
        // Remember, these array are accessed using array[y][x], NOT array[x][y]
    }
}();
let gridItem = function(name, description, fillColor) {
    this.name = name;
    this.description = description;
    this.fillColor = fillColor;
    this.drawGridItem = function(x, y) {
        if (this.fillColor) {
            drawRectFill(x, y, this.fillColor);
        }
        if (grid.accessMap[y][x] === 1) {
            drawRectOutline(x, y, "#00ff00");
        }
    };
};
grid.gridItem = [
    new gridItem("Empty", "There is nothing here.", false),
    new gridItem("Entry Node", "Your attack starts here.", "#00ff00"),
    new gridItem("Node Core", "Contains large quantities of sensitive information.", "#283747"),
    new gridItem("Firewall", "Prevents access.", "grey"),
    new gridItem("ICE", "Attacks Intruders.", "#E74C3C"),
    new gridItem("Server", "Contains information", "#2980B9"),
];

function draw() {
    createGridCoordinates();
    refresh();
}

function refresh() {
    // Refreshes the UI.
    grid.ctx.clearRect(0, 0, grid.gridWidth, grid.gridHeight);
    drawLineObjects();
    drawGridBase();
    drawGridItems();
}

function createGridCoordinates() {
    // Fills 2d array of coordinates for the grid.
    for (let y = 1; y < grid.gridHeight; y += grid.rectHeight) {
        for (let x = 1; x < grid.gridWidth; x += grid.rectWidth) {
            grid.coords[grid.coordX][grid.coordY] = {
                x: x,
                y: y
            };
            grid.coordX++;
        }
        grid.coordY++;
        grid.coordX = 0;
    }
}

function drawGridBase() {
    // Draws the grid based on coordinates.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            drawRectOutline(x, y);
        }
    }
}

function drawGridItems() {
    // Filles grid in with objects from the objectMap.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            const gridCoord = grid.objectMap[y][x];
            grid.gridItem[gridCoord].drawGridItem(x, y);
        }
    }
}

function drawLineObjects() {
    // Draws between rectangles on grid.
    // Lines are only drawn between two 1s that are touching on grid.lineMap.
    drawXLines();
    drawYLines();

    function drawXLines() {
        // Draws horizontal lines.
        for (let y = grid.coords.length - 1; y >= 0; y--) {
            for (let x = grid.coords[y].length - 1; x >= 0; x--) {
                if (checkForXLineNeighbour(x, y)) {
                    drawLine(x, y, x + 1, y);
                    drawRectFill(x, y, "black");
                    drawRectFill(x + 1, y, "black");
                }
            }
        }
    }

    function drawYLines() {
        // Draws vertical lines
        for (let y = grid.coords.length - 1; y >= 0; y--) {
            for (let x = grid.coords[y].length - 1; x >= 0; x--) {
                if (checkForYLineNeighbour(x, y)) {
                    drawLine(x, y, x, y + 1);
                    drawRectFill(x, y, "black");
                    drawRectFill(x, y + 1, "black");
                }
            }
        }
    }

    function checkForXLineNeighbour(x, y) {
        // Checks if there is a 1 to the right of x.
        if (x === grid.lineMap[9].length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y][x + 1] === 1) return true;
        else return false;
    }

    function checkForYLineNeighbour(x, y) {
        // Checks if there is a 1 below y.
        if (y === grid.lineMap.length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y + 1][x] === 1) return true;
        else return false;
    }
}
document.onkeydown = function(e) {
    // Player inputs.
    e = e || window.event;
    refresh();
    switch (e.keyCode) {
        case 37: // ArrowLeft
            movePointerLeft();
            break;
        case 38: // ArrowUp
            movePointerUp();
            break;
        case 39: // ArrowRight
            movePointerRight();
            break;
        case 40: // ArrowDown
            movePointerDown();
            break;
        case 32: // Spacebar
            playerAction();
            break;
    }
    pointerOverAccess();
};

function pointerOverAccess() {
    // If the pointer is over normal empties, display as white.
    // If the pointer is over player owned empties, display as light green.
    if (grid.accessMap[grid.pointerLoc.y][grid.pointerLoc.x] === 1) {
        drawRectOutline(grid.pointerLoc.x, grid.pointerLoc.y, "#B4FF96");
    } else drawRectOutline(grid.pointerLoc.x, grid.pointerLoc.y, "white");
    displayDetailText();
};

function playerAction() {
    const pointerOver = grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x];
    if (pointerOver === 0) {
        actionOnEmpty();
    }
    if (pointerOver === 5) {
        actionOnServer();
    }
}

function actionOnEmpty() {
    if (grid.lineMap[grid.pointerLoc.y][grid.pointerLoc.x] === 1 && checkForAccessNeighbour(grid.pointerLoc.x, grid.pointerLoc.y)) {
        grid.accessMap[grid.pointerLoc.y][grid.pointerLoc.x] = 1;
    }
}

function actionOnServer() {
    if (checkForAccessNeighbour(grid.pointerLoc.x, grid.pointerLoc.y)) {
        const gridCoord = grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x];
        grid.accessMap[grid.pointerLoc.y][grid.pointerLoc.x] = 1;
        grid.gridItem[gridCoord].drawGridItem([grid.pointerLoc.y], [grid.pointerLoc.x]);
    }
}

function checkForLineNeighbour(x, y) {
    return (checkLineAbove(x, y) || checkLineBelow(x, y) || checkLineLeft(x, y) || checkLineRight(x, y));
}

function checkLineAbove(x, y) {
    if (y === 0) {
        return false;
    } else if (grid.lineMap[y - 1][x] === 1) {
        return true;
    } else {
        return false;
    }
}

function checkLineBelow(x, y) {
    if (y === grid.lineMap.length - 1) {
        return false;
    } else if (grid.lineMap[y + 1][x] === 1) return true;
    else {
        return false;
    }
}

function checkLineLeft(x, y) {
    if (x === 0) {
        return false;
    } else if (grid.lineMap[y][x - 1] === 1) {
        return true;
    } else {
        return false;
    }
}

function checkLineRight(x, y) {
    if (x === grid.lineMap[y].length - 1) {
        return false;
    } else if (grid.lineMap[y][x + 1] === 1) {
        return true;
    } else {
        return false;
    }
}

function checkForAccessNeighbour(x, y) {
    return (checkAccessAbove(x, y) || checkAccessBelow(x, y) || checkAccessLeft(x, y) || checkAccessRight(x, y));
}

function checkAccessAbove(x, y) {
    if (y === 0) {
        return false;
    } else if (grid.accessMap[y - 1][x] === 1) {
        return true;
    } else {
        return false;
    }
}

function checkAccessBelow(x, y) {
    if (y === grid.accessMap.length - 1) {
        return false;
    } else if (grid.accessMap[y + 1][x] === 1) return true;
    else {
        return false;
    }
}

function checkAccessLeft(x, y) {
    if (x === 0) {
        return false;
    } else if (grid.accessMap[y][x - 1] === 1) {
        return true;
    } else {
        return false;
    }
}

function checkAccessRight(x, y) {
    if (x === grid.accessMap[y].length - 1) {
        return false;
    } else if (grid.accessMap[y][x + 1]) {
        return true;
    } else {
        return false;
    }
}

function displayDetailText() {
    let objectType = grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x];
    let displayText;
    let name = grid.gridItem[objectType].name;
    let desc = grid.gridItem[objectType].description;
    if (grid.accessMap[grid.pointerLoc.y][grid.pointerLoc.x] === 1) {
        displayText = name + ": " + desc + "<br />" + "You have access to this.";
    } else displayText = name + ": " + desc;
    HTMLEditor("hackGameDetailText", displayText);
}

function movePointerUp() {
    if (grid.pointerLoc.y !== 0) {
        grid.pointerLoc.y--;
    }
}

function movePointerDown() {
    if (grid.pointerLoc.y !== grid.coords.length - 1) {
        grid.pointerLoc.y++;
    }
}

function movePointerLeft() {
    if (grid.pointerLoc.x !== 0) {
        grid.pointerLoc.x--;
    }
}

function movePointerRight() {
    if (grid.pointerLoc.x !== grid.coords[0].length - 1) {
        grid.pointerLoc.x++;
    }
}

function drawRectFill(x, y, color = "orange") {
    // Draws a full color square.
    grid.ctx.lineWidth = "3";
    grid.ctx.fillStyle = color;
    let drawX = grid.coords[x][y].x - 1;
    let drawY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth - grid.rectPadding + 2;
    let rectHeight = grid.rectHeight - grid.rectPadding + 2;
    grid.ctx.fillRect(drawX, drawY, rectWidth, rectHeight);
}

function drawRectOutline(x, y, color = "#7D3C98") {
    // Draws the outline of a square.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    let drawX = grid.coords[x][y].x;
    let drawY = grid.coords[x][y].y;
    let rectWidth = grid.rectWidth - grid.rectPadding;
    let rectHeight = grid.rectHeight - grid.rectPadding;
    grid.ctx.strokeRect(drawX, drawY, rectWidth, rectHeight);
}

function drawLine(startXC, startYC, endXC, endYC, color = "#D35400") {
    // Draws a line between two points.
    grid.ctx.lineWidth = "3";
    grid.ctx.strokeStyle = color;
    let Xoffset = (grid.rectWidth - grid.rectPadding) / 2;
    let Yoffset = (grid.rectHeight - grid.rectPadding) / 2;
    let startX = grid.coords[startXC][startYC].x + Xoffset - 0;
    let startY = grid.coords[startXC][startYC].y + Yoffset - 0;
    let endX = grid.coords[endXC][endYC].x + Xoffset + 0;
    let endY = grid.coords[endXC][endYC].y + Yoffset + 0;
    grid.ctx.beginPath();
    grid.ctx.moveTo(startX, startY);
    grid.ctx.lineTo(endX, endY);
    //grid.ctx.lineCap = "square";
    grid.ctx.stroke();
}

function drawRectClear(x, y) {
    // Hides a grid square.
    let hideX = grid.coords[x][y].x - 1;
    let hideY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth;
    let rectHeight = grid.rectHeight;
    grid.ctx.clearRect(hideX, hideY, rectWidth, rectHeight);
}

function showPointerLoc() {
    // debug.
    console.log("x: " + grid.pointerLoc.x, "y: " + grid.pointerLoc.y);
}