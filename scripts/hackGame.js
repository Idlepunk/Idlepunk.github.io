let grid = new function() {
    var canvas = document.getElementById("hackGame");
    if (canvas.getContext) {
        this.ctx = canvas.getContext("2d");
        this.gridHeight = 301;
        this.gridWidth = 301;
        this.rectHeight = 30;
        this.rectWidth = 30;
        this.rectPadding = 10;
        this.rectOutline = "orange";
        this.coords = [
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
        ];
        this.coordX = 0;
        this.coordY = 0;
    }
}();

function draw() {
    createGrid();
    fillCoord(3, 3, "red");
    hideCoord(4, 3);
    strokeCoord(5, 3, "blue");
    drawLine(0, 0, 0, 1);
    drawLine(0, 0, 1, 0);
}

function createGrid() {
    for (let y = 1; y < grid.gridHeight; y += grid.rectHeight) {
        for (let x = 1; x < grid.gridWidth; x += grid.rectWidth) {
            //console.log(x, y)
            grid.coords[grid.coordX][grid.coordY] = {
                x: x,
                y: y
            };
            grid.coordX++;
            grid.ctx.strokeStyle = grid.rectOutline;
            grid.ctx.strokeRect(x, y, grid.rectWidth - grid.rectPadding, grid.rectHeight - grid.rectPadding);
        }
        grid.coordY++;
        grid.coordX = 0;
    }
}

function fillCoord(x, y, color = "orange") {
    grid.ctx.fillStyle = color;

    let drawX = grid.coords[x][y].x - 1;
    let drawY = grid.coords[x][y].y - 1;

    let rectWidth = grid.rectWidth - grid.rectPadding + 2;
    let rectHeight = grid.rectHeight - grid.rectPadding + 2;

    grid.ctx.fillRect(drawX, drawY, rectWidth, rectHeight);
}

function strokeCoord(x, y, color = "orange") {
    grid.ctx.strokeStyle = color;

    let drawX = grid.coords[x][y].x;
    let drawY = grid.coords[x][y].y;

    let rectWidth = grid.rectWidth - grid.rectPadding;
    let rectHeight = grid.rectHeight - grid.rectPadding;

    grid.ctx.strokeRect(drawX, drawY, rectWidth, rectHeight);
}

function drawLine(startXC, startYC, endXC, endYC, color = "orange") {
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
    grid.ctx.lineWidth = "5";
    grid.ctx.stroke();
}

function hideCoord(x, y) {
    let hideX = grid.coords[x][y].x - 1;
    let hideY = grid.coords[x][y].y - 1;

    let rectWidth = grid.rectWidth;
    let rectHeight = grid.rectHeight;

    grid.ctx.clearRect(hideX, hideY, rectWidth, rectHeight);
}
