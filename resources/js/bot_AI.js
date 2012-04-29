function maxArrVal(array){              // Some basic and useful array operation functions
    var max=0;
    for(i=0;i < array.length;i++){
        max = Math.max(max, array[i]);
    }
    return max;
}
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

// Below are the recursive functions used to assign heuristic values to each possible move
function heurDown(board, row, col, piece) {                                                  
    if(row+1 >= numRows || board[row+1][col] != piece) return 1;
    return 1 + heurDown(board, row+1, col, piece);
}
function heurLeft(board, row, col, piece) {
    if(col-1 < 0 || board[row][col-1] != piece) return 1;
    return 1 + heurLeft(board, row, col-1, piece);
}
function heurRight(board, row, col, piece) {
    if(col+1 >= numCols || board[row][col+1] != piece) return 1;
    return 1 + heurRight(board, row, col+1, piece);
}
function heurUpLeft(board, row, col, piece) {
    if(row-1 < 0 || col-1 < 0 || board[row-1][col-1] != piece) return 1;
    return 1 + heurUpLeft(board, row-1, col-1, piece);
}
function heurUpRight(board, row, col, piece) {
    if(row-1 < 0 || col+1 >= numCols || board[row-1][col+1] != piece) return 1;
    return 1 + heurUpRight(board, row-1, col+1, piece);
}
function heurDownLeft(board, row, col, piece) {
    if(row+1 >= numRows || col-1 < 0 || board[row+1][col-1] != piece) return 1;
    return 1 + heurDownLeft(board, row+1, col-1, piece);
}
function heurDownRight(board, row, col, piece) {
    if(row+1 >= numRows || col+1 >= numCols || board[row+1][col+1] != piece) return 1;
    return 1 + heurDownRight(board, row+1, col+1, piece);
}

function heurValue(board, row, col, piece){
    hDown = heurDown(board, row, col, piece) + 1;        // +1 compensates for the lack of double-counting the dropped piece
    hHori = heurLeft(board, row, col, piece) + heurRight(board, row, col, piece);
    hDia1 = heurUpLeft(board, row, col, piece) + heurDownRight(board, row, col, piece);
    hDia2 = heurDownLeft(board, row, col, piece) + heurUpRight(board, row, col, piece);
    
    return Math.max(hDown, hHori, hDia1, hDia2);
}
// *********************************************************************************************************************

function heuristicMove(board){                          // This is the function that ultimately moves the Bot's pieces
    var lastRow = 0;
    var hArray = [board[0].length];    
    for(x=0; x < hArray.length; x++){hArray[x] = 0;}    // Initialize the heuristicArray
        
    for(i=0; i < numCols; i++){
        lastRow = numRows - 1;
        
        var skipCol = false;                            // Skip the column if it's full, by leaving it's heuristic value at 0
        while(board[lastRow][i] != Piece.Empty){        // Just like the dropPiece function, this finds the last empty row in a column
            lastRow--;
            if(lastRow < 0) {
                skipCol = true;
                break;
            }
        }
        if(skipCol) continue;
            
        if(heurValue(board, lastRow, i, Piece.PlayerTwo) >= 5) hArray[i] = 10;    // If the bot can win this turn, the column is highest priority
        else if(heurValue(board, lastRow, i, Piece.PlayerOne) >= 5) hArray[i] = 9; // If the player can win next turn, the column is high priority
        else if(lastRow-1 >= 0 && heurValue(board, lastRow-1, i, Piece.PlayerOne) >= 5) hArray[i] = 1; // If dropping a piece lets the Player win next turn, the column is low priority
        else if(lastRow-1 >= 0 && heurValue(board, lastRow-1, i, Piece.PlayerTwo) >= 5) hArray[i] = 2; // If dropping a piece lets the Player block the bot's win next turn, the column is low priority
        else hArray[i] = heurValue(board, lastRow, i, Piece.PlayerOne);     // The heuristic array is completed after the last iteration of the for loop
            
    }
        
    var botMoveCol = maxArrValIndex(hArray);              // The column that the Bot chooses corresponds to the largest heuristic valued move    
    lastRow = numRows - 1;
    while(board[lastRow][botMoveCol] != Piece.Empty){     // Again, finding the last empty row
        lastRow--;
    }
        
    board[lastRow][botMoveCol] = Piece.PlayerTwo;         // Finally, bot "drops" a piece
        
    turn = Piece.PlayerOne;      // These three must be updated everytime a piece is dropped
    lastPieceRow = lastRow;
    lastPieceCol = botMoveCol;
}
