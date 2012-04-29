var numRows = 6;                        // 6 rows x 7 columns Connect Four Board
var numCols = 7;
var blockWidth = 65;                    // Each block, or "space" on the board will be 65px squares on the canvas element
var blockHeight = 65;
var width = blockWidth * numCols;       // The overall dimensions of the canvas are calculated
var height = blockHeight * numRows;

var Piece = {Empty : 0, PlayerOne : 1, PlayerTwo : 2};      // The Piece class, which represents the 3 states of a board space

var turn;                               // Keeps track of whose turn it is, Player or Bot
var gameOver;                           // Boolean that keeps track of whether the game has ended
var playerMovedYet;                     // Boolean that keeps track of whether Player has successfully dropped a piece
var movingCol = 0;                      // Keeps track of which column the PLayer clicks in
var lastPieceRow = 0;                   // Two important variables that keep track of which piece was dropped in most recently
var lastPieceCol = 0;
var playerWins = 0;                     // Two global variables that track scores
var botWins = 0;

function initializeGame() {             // Important values are initialized
    turn = Piece.PlayerOne;
    gameOver = false;
    playerMovedYet = false;
    $("#player_score").text(playerWins);        // Initialize or update the scoreboard
    $("#bot_score").text(botWins);
}

function initializeBoard() {            // A blank Connect Four Board is created
    var board = [];

    for(var i = 0; i < numRows; i++) {
        board[i] = [];
        for(var j = 0; j < numCols; j++) {
            board[i][j] = Piece.Empty;
        }
    }

    return board;
}

function intro(ctx){                    // A little message that prompts the user to click the board to begin, only draws once, on page load
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.font = "60px sans-serif";
    ctx.fillText("Click a Column", width / 3 - 120, height / 2);
    ctx.font = "20px sans-serif";
    ctx.fillText("To begin the game.", width / 3 - 87, height / 2 + 30);
}

function fillCircle(ctx, x, y, r) {     // Draws circles on the HTML canvas
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
}

function renderBoard(ctx, board) {      // When called, it draws the entire state of the board onto the HTML canvas
    ctx.strokeStyle = "black";
    for(var i = 0; i < numRows; i++) {
        for(var j = 0; j < numCols; j++) {
            ctx.save();
            ctx.strokeStyle = "black";                       // Draws the board's grid
            ctx.strokeRect(j * blockWidth, i * blockHeight,
                           blockWidth, blockHeight);
            ctx.restore();
            if(board[i][j] == Piece.PlayerOne) {            // Draws Red Player Pieces
                ctx.fillStyle = "red";
                fillCircle(ctx, j * blockWidth + blockWidth / 2,
                           i * blockHeight + blockHeight / 2,
                           blockWidth / 2 * 0.9);
            } else if(board[i][j] == Piece.PlayerTwo) {     // Draws Yellow Bot Pieces
                ctx.fillStyle = "yellow";
                fillCircle(ctx, j * blockWidth + blockWidth / 2,
                           i * blockHeight + blockHeight / 2,
                           blockWidth / 2 * 0.9);
            }
        }
    }
}

function mouseMove(e) {             // Keeps track of the mouse's position on the HTML canvas
    var x = 0;

    if(e.offsetX) {                 // Since the mouses's coordinates are relative to the browser and not the canvas, this removes the offset
        x = e.offsetX;
    } else if(e.layerX) {
        x = e.layerX;
    }

    movingCol = Math.floor(x / blockWidth);     // Snaps the mouse's x-coordinate to the appropriate column
}

function clearBoard(ctx) {                      // Whites out the canvas, so it can be updated and redrawn by renderBoard()
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
}

function dropPiece(board) {                     // Important function that determines how the pieces move
    playerMovedYet = false;                     // In case a column already full is clicked, we keep track of whether the player was successful in dropping a piece
    
    var lastRow = numRows - 1;                  // Finds the first empty row to place a piece in, like how gravity works IRL
    while(board[lastRow][movingCol] != Piece.Empty) {
        lastRow--;
        if(lastRow < 0) return;
    }

    board[lastRow][movingCol] = Piece.PlayerOne;
    lastPieceRow = lastRow;                     // Updates last moved piece to be the piece just dropped
    lastPieceCol = movingCol;
    turn = Piece.PlayerTwo;                     // It's now the Bot's turn to move
    playerMovedYet = true;
}

function checkDown(board, row, col) {            // recursive functions to check for consecutive pieces in the eight zones surrounding a particular piece
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

function checkVerticalWin(board) {                                      // These 3 functions utilize the above recursive funtions to check for 3 types of wins
    if(checkDown(board, lastPieceRow, lastPieceCol) >= 4) return true;
    return false;
}
function checkHorizontalWin(board) {
    if(checkLeft(board, lastPieceRow, lastPieceCol) + checkRight(board, lastPieceRow, lastPieceCol) >= 5) return true;      // The value 5 is used because the last moved piece is double-counted
    return false;
}
function checkDiagonalWin(board) {
    if(checkUpLeft(board, lastPieceRow, lastPieceCol) + checkDownRight(board, lastPieceRow, lastPieceCol) >= 5) return true;
    if(checkUpRight(board, lastPieceRow, lastPieceCol) + checkDownLeft(board, lastPieceRow, lastPieceCol) >= 5) return true;
    return false;
}

function isGameOver(board) {                // If any of the 3 types of wins occured, the game is over
    return checkVerticalWin(board) ||
           checkHorizontalWin(board) ||
           checkDiagonalWin(board);
}

function boardFull(board) {                 // Checks of the board is full, meaning tie game
    for(var i = 1; i < numRows; i++) {
        for(var j = 0; j < numCols; j++) {
            if(board[i][j] === Piece.Empty) {
                return false;
            }
        }
    }

    return true;
}

function checkGameOver(ctx, board) {        // Checks for game over and doles out the congratulations
    var gameOverText = "% wins!";

    ctx.save();
    ctx.fillStyle = "blue";
    ctx.font = "60px sans-serif";

    if(isGameOver(board)) {
        if(turn == Piece.PlayerOne) {                           // If the game ended when Player was just about to move, that means the Bot won. And vice versa.
            gameOverText = gameOverText.replace("%", "Yellow");
            botWins++;
            alert("The Bot AI Wins!");
        }
        else if(turn == Piece.PlayerTwo) {
            gameOverText = gameOverText.replace("%", "Red");
            playerWins++;
            alert("You've Won!");
        }

        ctx.fillText(gameOverText, width / 3 - 100, height / 2);
        ctx.font = "20px sans-serif";
        ctx.fillText("Click again for a new game.", width / 3 - 90, height / 2 + 30);
        gameOver = true;
    }
    else if(boardFull(board)) {                    // Either someone won or the board filled up and it's a tie game
        alert("It's a tie game.");
        ctx.fillText("Tie Game", width / 3 - 100, height / 2);
        ctx.font = "20px sans-serif";
        ctx.fillText("Click again for a new game.", width / 3 - 95, height / 2 + 30);
        gameOver = true;
    }

    ctx.restore();
}

function draw() {           // This is the main function, which calls all the others
    var canvas;
    var ctx;
    var board;
    if($.browser.mozilla) alert("Disclaimer: Connect Four does not work in Mozilla Firefox. Please use Chrome or Safari to play.");

    initializeGame();
    board = initializeBoard();

    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.onmousemove = mouseMove;
    
    ctx = canvas.getContext("2d");
    clearBoard(ctx);
    renderBoard(ctx, board);
    intro(ctx);
    canvas.onmouseup =                      // This is critical. The board is updated and re-rendered everytime the mouse is released.
    function(e) {                           // The Player moves first and the Bot moves immediately afterwards.
        if(!gameOver){                      
            dropPiece(board);
            clearBoard(ctx);
            renderBoard(ctx, board);
            checkGameOver(ctx, board);
                           
            if(!gameOver && playerMovedYet){
                heuristicMove(board);
                clearBoard(ctx);
                renderBoard(ctx, board);
                checkGameOver(ctx, board);
            }
        }
        else{                               // When someone (or thing) wins, then a new game begins after a prompt. So you don't have to reload the page.
            alert("Now starting a new game of Connect Four.")
            initializeGame();
            board = initializeBoard();
            clearBoard(ctx);
            renderBoard(ctx, board);
            gameOver = false;
        }
    };
}