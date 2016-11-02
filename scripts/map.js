let grid = new function() {
    const canvas = document.getElementById("hackGame");
    if (canvas.getContext) {
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = "2"
        this.gridHeight = 301;
        this.gridWidth = 301;
        this.rectHeight = 30;
        this.rectWidth = 30;
        this.rectPadding = 10;
        this.rectOutline = "orange";
        this.coords = [[],[],[],[],[],[],[],[],[],[]];
        this.coordX = 0;
        this.coordY = 0;
        this.pointerLoc = {x: 0, y: 0 }

        this.objects = [
            {name: "Empty"},

            {name: "Entry node",
            description: "Your attack starts here."},

            {name: "Node Core",
            description: "Contains large quantities of sensitive information."},

            {name: "Firewall",
            description: "stops access"},

            {name: "ICE",
            description: "Attacks intruders."},

            {name: "Server",
            description: "Contains information."},

            {name: "Accessed Server",
            description: "You have access this server already."},

            {name: "Accessed Empty",
            description: "You have control over this area."}
        ]

        
            // 0 = blank
            // 1 = start
            // 2 = end
            // 3 = firewall
            // 4 = ICE
            // 5 = server
            // what things will be on the game's grid.
        this.objectMap = [
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
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
        this.objectMap = transposeArray(this.objectMap);
        // Where lines should appear running through the grid.
        this.lineMap = [
            [1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
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
        this.lineMap = transposeArray(this.lineMap)
    }
}();

function transposeArray(a) {
  return a[0].map(function (_, c) { return a.map(function (r) { return r[c]; }); });
}

function draw() {
    createGrid();
    baseGrid();
}

function baseGrid() {
    grid.ctx.clearRect(0,0, grid.gridWidth, grid.gridHeight);
    drawLineObjects();
    drawGrid();
    drawObjects();
}

function createGrid() {
    // Fills 2d array of coordinates for the grid.
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
    // Draws the grid based on coordinates.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            strokeCoord(x, y);
        }
    }
}

function drawObjects() {
    // Filles grid in with objects from the objectMap.
    for (let y = grid.coords.length - 1; y >= 0; y--) {
        for (let x = grid.coords[y].length - 1; x >= 0; x--) {
            switch (grid.objectMap[y][x]) {
                case 1:
                    fillCoord(x, y, "#00ff00");
                    break;
                case 2:
                    fillCoord(x, y, "#283747");
                    break;
                case 3:
                    fillCoord(x, y, "grey");
                    break;
                case 4:
                    fillCoord(x, y, "#E74C3C");
                    break;
                case 5:
                    fillCoord(x, y, "#2980B9");
                    break;
                case 6:
                    fillCoord(x, y, "#2980B9");
                    strokeCoord(x, y, "#00ff00");
                    break;
                case 7:
                    strokeCoord(x, y, "#00ff00");
                    break;
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
                if (checkForXLineNeighbour(x, y)) {
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
                if (checkForYLineNeighbour(x, y)) {
                    drawLine(x, y, x, y + 1);
                    fillCoord(x, y, "black");
                    fillCoord(x, y + 1, "black");
                }
            }
        }
    }

    function checkForXLineNeighbour(x, y) {
        if (x === grid.lineMap[9].length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y][x + 1] === 1) return true;
        else return false;
    }

    function checkForYLineNeighbour(x, y) {
        if (y === grid.lineMap.length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y + 1][x] === 1) return true;
        else return false;
    }
}
document.onkeydown = function(e) {
    e = e || window.event;
    // use e.keyCode
    hideCoord(grid.pointerLoc.x, grid.pointerLoc.y)
        //strokeCoord(grid.pointerLoc.x, grid.pointerLoc.y);
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
    if (e.key === " ") {
        playerAction();
    }
    //fillCoord(grid.pointerLoc.x, grid.pointerLoc.y, "white");
    strokeCoord(grid.pointerLoc.x, grid.pointerLoc.y, "white");
    displayDetailText();
};

function playerAction() {
    const pointerOver = grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x];

    if (pointerOver === 0) {
        useEmpty();
    }

    if (pointerOver === 5) {
        useServer();
    }

}

function useEmpty() {
    if (grid.lineMap[grid.pointerLoc.y][grid.pointerLoc.x] === 1) {
        grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x] = 7;
    }
}

function useServer() {
    grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x] = 6;
}

function checkForNeighbour(x, y) {
    checkAbove(x, y);
    checkBelow(x, y);
    checkLeft(x, y);
    checkRight(x, y);



        if (x === grid.lineMap[9].length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y][x + 1] === 1) return true;
        else return false;


        if (y === grid.lineMap.length - 1) return false;
        else if (grid.lineMap[y][x] === 1 && grid.lineMap[y + 1][x] === 1) return true;
        else return false;
}

    function checkAbove(x, y){
        if (y === 0) {
            return false;
        }
        else if (grid.lineMap[y+1][x] === 1) {
            return true;
        }
        else {
            return false;
        }


    }
    function checkBelow(x, y){
        if (y === grid.lineMap.length - 1) {
            return false;
        }
        else if (grid.lineMap[y-1][x] === 1)
            return true;
        else {
            return false;
        }

    }
    function checkLeft(x, y){

    }
    function checkRight(x, y){

    }

function displayDetailText() {

    let objectType = grid.objectMap[grid.pointerLoc.y][grid.pointerLoc.x]
    let text = "Nothing";
    if (grid.objects[objectType].description) {
        text = grid.objects[objectType].name;
        text += ": "
        text += grid.objects[objectType].description;
    }
    else text = "--"

    HTMLEditor("hackGameDetailText", text);
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

function fillCoord(x, y, color = "orange") {
    // Draws a full color square.
    grid.ctx.lineWidth = "3";
    grid.ctx.fillStyle = color;
    let drawX = grid.coords[x][y].x - 1;
    let drawY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth - grid.rectPadding + 2;
    let rectHeight = grid.rectHeight - grid.rectPadding + 2;
    grid.ctx.fillRect(drawX, drawY, rectWidth, rectHeight);
}

function strokeCoord(x, y, color = "#7D3C98") {
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

function hideCoord(x, y) {
    // Hides a grid square.
    let hideX = grid.coords[x][y].x - 1;
    let hideY = grid.coords[x][y].y - 1;
    let rectWidth = grid.rectWidth;
    let rectHeight = grid.rectHeight;
    grid.ctx.clearRect(hideX, hideY, rectWidth, rectHeight);
}

function showPointerLoc() {
    console.log("x: " + grid.pointerLoc.x, "y: " + grid.pointerLoc.y)
}