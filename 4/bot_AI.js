function maxArrValIndex(array){
    var max=0;
    var maxIndex=0;
    for(i=0;i < array.length;i++){
        if(max < array[i]){
            maxIndex = i;
            max = array[i];
        }
    }
    return maxIndex;
}

// Below are the recursive functions used to assign heuristic values to each possibel move
function heurDown(board, row, col) {                                                  
    if(row+1 >= numRows || board[row+1][col] != Piece.PlayerOne) return 1;
    return 1 + heurDown(board, row+1, col);
}
function heurLeft(board, row, col) {
    if(col-1 < 0 || board[row][col-1] != Piece.PlayerOne) return 1;
    return 1 + heurLeft(board, row, col-1);
}
function heurRight(board, row, col) {
    if(col+1 >= numCols || board[row][col+1] != Piece.PlayerOne) return 1;
    return 1 + heurRight(board, row, col+1);
}
function heurUpLeft(board, row, col) {
    if(row-1 < 0 || col-1 < 0 || board[row-1][col-1] != Piece.PlayerOne) return 1;
    return 1 + heurUpLeft(board, row-1, col-1);
}
function heurUpRight(board, row, col) {
    if(row-1 < 0 || col+1 >= numCols || board[row-1][col+1] != Piece.PlayerOne) return 1;
    return 1 + heurUpRight(board, row-1, col+1);
}
function heurDownLeft(board, row, col) {
    if(row+1 >= numRows || col-1 < 0 || board[row+1][col-1] != Piece.PlayerOne) return 1;
    return 1 + heurDownLeft(board, row+1, col-1);
}
function heurDownRight(board, row, col) {
    if(row+1 >= numRows || col+1 >= numCols || board[row+1][col+1] != Piece.PlayerOne) return 1;
    return 1 + heurDownRight(board, row+1, col+1);
}

function heurValue(board, row, col){
    hDown = heurDown(board, row, col) + 1;                                      // I added the +1 when I noticed a tendancy of the bot to overlook the player's vertical wins
    hHori = heurLeft(board, row, col) + heurRight(board, row, col);
    hDia1 = heurUpLeft(board, row, col) + heurDownRight(board, row, col);
    hDia2 = heurDownLeft(board, row, col) + heurUpRight(board, row, col);
    
    return Math.max(hDown, hHori, hDia1, hDia2);
}
// *********************************************************************************************************************

function heuristicMove(board){                           // This is the function that ultimately moves the Bot's pieces
    var lastRow = 0;
    var hArray = [board[0].length];
    for(x=0; x < hArray.length; x++){hArray[x] = 0;}     // Initialize the heuristicArray
    
    for(i=0; i < numCols; i++){
        lastRow = numRows - 1;
        
        skipCol = false;
        while(board[lastRow][i] != Piece.Empty){
            lastRow--;
            if(lastRow < 0) {
                skipCol = true;
                break;
            }
        }
        if(skipCol) continue;
        
        hArray[i] = heurValue(board, lastRow, i);         // The heuristic array is completed after the last iteration of the for loop 
    }
    
    var botMoveCol = maxArrValIndex(hArray);              // The column that the Bot chooses corresponds to the largest heuristic valued move
    lastRow = numRows - 1;
    while(board[lastRow][botMoveCol] != Piece.Empty){     // This line essentially recreates the part of dropPiece() that finds the first empty row
            lastRow--;
    }
    board[lastRow][botMoveCol] = Piece.PlayerTwo;
    
    turn = Piece.PlayerOne;                               // These three must be updated everytime a piece is dropped
    lastPieceRow = lastRow;
    lastPieceCol = botMoveCol;
}