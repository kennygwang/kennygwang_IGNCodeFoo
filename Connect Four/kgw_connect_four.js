var numRows = 6;
var numCols = 7;
var blockWidth = 70;
var blockHeight = 70;
var width = blockWidth * numCols;
var height = blockHeight * numRows;
var lineLength = 4;

var Piece = {Empty : 0, PlayerOne : 1, PlayerTwo : 2};

var turn;
var gameOver;
var playerMovedYet = false;
var movingRow = 0;
var movingCol = 0;
var lastPieceRow = 0;
var lastPieceCol = 0;

function initializeGame() {
    turn = Piece.PlayerOne;
    gameOver = false;
}

function initializeBoard() {
    var board = [];

    for(var i = 0; i < numRows; i++) {
        board[i] = [];
        for(var j = 0; j < numCols; j++) {
            board[i][j] = Piece.Empty;
        }
    }

    return board;
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
}

function renderBoard(ctx, board) {
    ctx.strokeStyle = "black";
    for(var i = 0; i < numRows; i++) {
        for(var j = 0; j < numCols; j++) {
            ctx.save();
            ctx.strokeStyle = "blue";
            ctx.strokeRect(j * blockWidth, i * blockHeight,
                           blockWidth, blockHeight);
            ctx.restore();
            if(board[i][j] == Piece.PlayerOne) {
                ctx.fillStyle = "red";
                fillCircle(ctx, j * blockWidth + blockWidth / 2,
                           i * blockHeight + blockHeight / 2,
                           blockWidth / 2 * 0.9);
            } else if(board[i][j] == Piece.PlayerTwo) {
                ctx.fillStyle = "yellow";
                fillCircle(ctx, j * blockWidth + blockWidth / 2,
                           i * blockHeight + blockHeight / 2,
                           blockWidth / 2 * 0.9);
            }
        }
    }
}

function mouseMove(e) {
    var x = 0;

    if(e.offsetX) {
        x = e.offsetX;
    } else if(e.layerX) {
        x = e.layerX;
    }

    movingCol = Math.floor(x / blockWidth);
}

function clearBoard(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
}

function dropPiece(board) {
    playerMovedYet = false;
    
    var lastRow = numRows - 1;
    while(board[lastRow][movingCol] != Piece.Empty) {
        lastRow--;
        if(lastRow < 0) return;
    }

    board[lastRow][movingCol] = Piece.PlayerOne;
    lastPieceRow = lastRow;
    lastPieceCol = movingCol;
    turn = Piece.PlayerTwo;
    playerMovedYet = true;
}

function checkDown(board, row, col) {                                                  // recursive functions to check for consecutive pieces in the eight zones surrounding a particular piece
    if(row+1 >= numRows || board[row][col] != board[row+1][col]) return 1;
    return 1 + checkDown(board, row+1, col);
}
function checkLeft(board, row, col) {
    if(col-1 < 0 || board[row][col] != board[row][col-1]) return 1;
    return 1 + checkLeft(board, row, col-1);
}
function checkRight(board, row, col) {
    if(col+1 >= numCols || board[row][col] != board[row][col+1]) return 1;
    return 1 + checkRight(board, row, col+1);
}
function checkUpLeft(board, row, col) {
    if(row-1 < 0 || col-1 < 0 || board[row][col] != board[row-1][col-1]) return 1;
    return 1 + checkUpLeft(board, row-1, col-1);
}
function checkUpRight(board, row, col) {
    if(row-1 < 0 || col+1 >= numCols || board[row][col] != board[row-1][col+1]) return 1;
    return 1 + checkUpRight(board, row-1, col+1);
}
function checkDownLeft(board, row, col) {
    if(row+1 >= numRows || col-1 < 0 || board[row][col] != board[row+1][col-1]) return 1;
    return 1 + checkDownLeft(board, row+1, col-1);
}
function checkDownRight(board, row, col) {
    if(row+1 >= numRows || col+1 >= numCols || board[row][col] != board[row+1][col+1]) return 1;
    return 1 + checkDownRight(board, row+1, col+1);
}

function checkVerticalWin(board) {
    if(checkDown(board, lastPieceRow, lastPieceCol) >= 4) return true;
    return false;
}
function checkHorizontalWin(board) {
    if(checkLeft(board, lastPieceRow, lastPieceCol) + checkRight(board, lastPieceRow, lastPieceCol) >= 5) return true;
    return false;
}
function checkDiagonalWin(board) {
    if(checkUpLeft(board, lastPieceRow, lastPieceCol) + checkDownRight(board, lastPieceRow, lastPieceCol) >= 5) return true;
    if(checkUpRight(board, lastPieceRow, lastPieceCol) + checkDownLeft(board, lastPieceRow, lastPieceCol) >= 5) return true;
    return false;
}

function isGameOver(board) {
    return checkVerticalWin(board) ||
           checkHorizontalWin(board) ||
           checkDiagonalWin(board);
}

function boardFull(board) {
    for(var i = 1; i < numRows; i++) {
        for(var j = 0; j < numCols; j++) {
            if(board[i][j] == Piece.Empty) {
                return false;
            }
        }
    }

    return true;
}

function handleGameOver(ctx, board) {
    var gameOverText = "% wins!";

    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "60px sans-serif";

    if(isGameOver(board)) {
        if(turn == Piece.PlayerOne) {
            gameOverText = gameOverText.replace("%", "Yellow");
            alert("The Bot AI Wins!");
        }
        else if(turn == Piece.PlayerTwo) {
            gameOverText = gameOverText.replace("%", "Red");
            alert("You've Won!");
        }

        ctx.fillText(gameOverText, width / 2 - 100, height / 2);
        gameOver = true;
    }
    else if(boardFull(board) && !gameOver) {
        alert("It's a tie game.");
        ctx.fillText("Game Tied", width / 2 - 100, height / 2);
        gameOver = true;
    }

    ctx.restore();
}

function draw() {
    var canvas;
    var ctx;
    var board;

    initializeGame();
    board = initializeBoard();

    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.onmousemove = mouseMove;
    
    ctx = canvas.getContext("2d");
    renderBoard(ctx, board);
    canvas.onmouseup =
    function(e) {
        if(!gameOver){
            dropPiece(board);
            clearBoard(ctx);
            renderBoard(ctx, board);
            handleGameOver(ctx, board);
                           
            if(!gameOver && playerMovedYet){
                heuristicMove(board);
                clearBoard(ctx);
                renderBoard(ctx, board);
                handleGameOver(ctx, board);
            }
        }
        else{
            alert("Now starting a new game of Connect Four.")
            initializeGame();
            board = initializeBoard();
            clearBoard(ctx);
            renderBoard(ctx, board);
            gameOver = false;
        }
    };
}