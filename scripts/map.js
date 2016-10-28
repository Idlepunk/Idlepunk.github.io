let grid = new function() {
    const canvas = document.getElementById("hackGame");
    if (canvas.getContext) {
        this.ctx = canvas.getContext("2d");
        this.gridHeight = 301;
        this.gridWidth = 301;
        this.rectHeight = 30;
        this.rectWidth = 30;
        this.rectPadding = 10;
        this.rectOutline = "orange";
        this.coords = [[],[],[],[],[],[],[],[],[],[]];
        this.coordX = 0;
        this.coordY = 0;
        this.pointerLoc = {x: 5, y: 5 }
        
            // 0 = blank
            // 1 = start
            // 2 = end
            // 3 = firewall
            // 4 = ICE
            // 5 = server
            // what things will be on the game's grid.
        this.objectMap = [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
            [0, 3, 5, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 4, 0, 0, 0, 3, 3, 3],
            [0, 0, 0, 0, 0, 0, 4, 3, 5, 5],
            [0, 0, 0, 0, 4, 0, 4, 3, 3, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 4, 0, 0, 3, 3],
            [0, 0, 0, 0, 0, 4, 0, 0, 3, 2]
        ];
        // Where lines should appear running through the grid.
        this.lineMap = [
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [0, 1, 1, 0, 0, 1, 1, 1, 1, 1]
        ];
    }
}();

function draw() {
    grid.ctx.lineWidth = "2";
    createGrid();
    baseGrid();
}

function baseGrid() {
    drawLineObjects();
    drawGrid();
    drawObjects();
}

function createGrid() {
    // Fills 2d array of coordiantes for the grid.
    for (let y = 1; y < grid.gridHeight; y += grid.rectHeight) {
        for (let x = 1; x < grid.gridWidth; x += grid.rectWidth) {
            //console.log(x, y)
            grid.coords[grid.coordX][grid.coordY] = {
                x: x,
                y: y
            };
            grid.coordX++;
            grid.ctx.strokeStyle = grid.rectOutline;
            //grid.ctx.strokeRect(x, y, grid.rectWidth - grid.rectPadding, grid.rectHeight - grid.rectPadding);
            //`strokeCoord(x, y)
        }
        grid.coordY++;
        grid.coordX = 0;
    }
}

function drawGrid() {
    // Draws the grid based on coordiantes.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            strokeCoord(x, y)
        }
    }
}

function drawObjects() {
    // Filles grid in with objects from the objectMap.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            switch (grid.objectMap[y][x]) {
                case 1:
                    fillCoord(x, y, "Green");
                    break;
                case 2:
                    fillCoord(x, y, "White");
                    break;
                case 3:
                    fillCoord(x, y, "grey");
                    break;
                case 4:
                    fillCoord(x, y, "red");
                    break;
                case 5:
                    fillCoord(x, y, "purple")
            }
        }
    }
}

function drawLineObjects() {
    // Draws lines to grid.
    drawXLines();
    drawYLines();

    function drawXLines() {
        for (let y = grid.coords.length - 1; y >= 0; y--) {
            for (let x = grid.coords[y].length - 1; x >= 0; x--) {
                if (checkForXNeighbour(x, y)) {
                    drawLine(x, y, x + 1, y);
                    fillCoord(x, y, "black");
                    fillCoord(x + 1, y, "black");
                }
            }
        }
    }

    function drawYLines() {
        for (let y = grid.coords.length - 1; y >= 0; y--) {
            for (let x = grid.coords[y].length - 1; x >= 0; x--) {
                if (checkForYNeighbour(x, y)) {
                    drawLine(x, y, x, y + 1);
                    fillCoord(x, y, "black");
                    fillCoord(x, y + 1, "black");
                }
            }
        }
    }

    function checkForXNeighbour(x, y) {
        if (x === grid.lineMap[9].length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y][x + 1] === 1) return true;
        else return false;
    }

    function checkForYNeighbour(x, y) {
        if (y === grid.lineMap.length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y + 1][x] === 1) return true;
        else return false;
    }
}
document.onkeydown = function(e) {
    e = e || window.event;
    // use e.keyCode
    grid.ctx.lineWidth = "2";
    hideCoord(grid.pointerLoc.x, grid.pointerLoc.y)
        //strokeCoord(grid.pointerLoc.x, grid.pointerLoc.y);
    drawGrid();
    baseGrid();
    if (e.key === "ArrowUp") {
        movePointerUp();
    }
    if (e.key === "ArrowDown") {
        movePointerDown();
    }
    if (e.key === "ArrowLeft") {
        movePointerLeft();
    }
    if (e.key === "ArrowRight") {
        movePointerRight();
    }
    if (e.key === "Space") {
        fillCoord(grid.pointerLoc.x, grid.pointerLoc.y)
    }
    //fillCoord(grid.pointerLoc.x, grid.pointerLoc.y, "white");
    strokeCoord(grid.pointerLoc.x, grid.pointerLoc.y, "white");
};

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

function fillCoord(x, y, color = "orange") {
    // Draws a full color square.
    grid.ctx.fillStyle = color;
    let drawX = grid.coords[x][y].x - 1;
    let drawY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth - grid.rectPadding + 2;
    let rectHeight = grid.rectHeight - grid.rectPadding + 2;
    grid.ctx.fillRect(drawX, drawY, rectWidth, rectHeight);
}

function strokeCoord(x, y, color = "orange") {
    // Draws the outline of a square.
    grid.ctx.strokeStyle = color;
    let drawX = grid.coords[x][y].x;
    let drawY = grid.coords[x][y].y;
    let rectWidth = grid.rectWidth - grid.rectPadding;
    let rectHeight = grid.rectHeight - grid.rectPadding;
    grid.ctx.strokeRect(drawX, drawY, rectWidth, rectHeight);
}

function drawLine(startXC, startYC, endXC, endYC, color = "Yellow") {
    // Draws a line between two points.
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
    grid.ctx.lineWidth = "2";
    grid.ctx.lineCap = "square";
    grid.ctx.stroke();
}

function hideCoord(x, y) {
    // Hides a grid square.
    let hideX = grid.coords[x][y].x - 1;
    let hideY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth;
    let rectHeight = grid.rectHeight;
    grid.ctx.clearRect(hideX, hideY, rectWidth, rectHeight);
}