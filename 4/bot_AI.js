function maxArrVal(array){
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

// Below are the recursive functions used to assign heuristic values to each possibel move
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
    hDown = heurDown(board, row, col, piece) + 1;                               // I added the +1 when I noticed a tendancy of the bot to overlook the player's vertical wins
    hHori = heurLeft(board, row, col, piece) + heurRight(board, row, col, piece);
    hDia1 = heurUpLeft(board, row, col, piece) + heurDownRight(board, row, col, piece);
    hDia2 = heurDownLeft(board, row, col, piece) + heurUpRight(board, row, col, piece);
    
    return Math.max(hDown, hHori, hDia1, hDia2);
}
// *********************************************************************************************************************

function heuristicMove(board){                           // This is the function that ultimately moves the Bot's pieces
    var lastRow = 0;
    var hArray = [board[0].length];
    var botMovedYet = false;
    
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
            
        hArray[i] = heurValue(board, lastRow, i, Piece.PlayerTwo);     // The heuristic array is completed after the last iteration of the for loop 
    }
    
    if(maxArrVal(hArray) >= 5){    
        var botMoveCol = maxArrValIndex(hArray);              // The column that the Bot chooses corresponds to the largest heuristic valued move
        lastRow = numRows - 1;
        while(board[lastRow][botMoveCol] != Piece.Empty){     // This line essentially recreates the part of dropPiece() that finds the first empty row
                lastRow--;
        }
        board[lastRow][botMoveCol] = Piece.PlayerTwo;
            
        turn = Piece.PlayerOne;                               // These three must be updated everytime a piece is dropped
        lastPieceRow = lastRow;
        lastPieceCol = botMoveCol;
        botMovedYet = true;                                   // The bot found an opportunity to win and successfully moved its piece.
    }
    
    if(!botMovedYet){
        for(x=0; x < hArray.length; x++){hArray[x] = 0;}     // Initialize the heuristicArray so that this time, it calculates the defensive heuristics
        
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
            
            hArray[i] = heurValue(board, lastRow, i, Piece.PlayerOne);     // The heuristic array is completed after the last iteration of the for loop 
        }
        
        var botMoveCol = maxArrValIndex(hArray);              // The column that the Bot chooses corresponds to the largest heuristic valued move    
        lastRow = numRows - 1;
        while(board[lastRow][botMoveCol] != Piece.Empty){     // This line essentially recreates the part of dropPiece() that finds the first empty row
                lastRow--;
        }
        
        if(lastRow-1 >= 0 && heurValue(board, lastRow-1, botMoveCol, Piece.PlayerOne) >= 5){     // If true, dropping a piece lets the Player win in their next turn
            hArray[botMoveCol] = 1;                                        // Make that move no longer an option by reducing its h value to 1 (because 1 is still better than a full column)
            botMoveCol = maxArrValIndex(hArray);                           // Reset botMoveCol to the next best heuristic value
            lastRow = numRows - 1;
            while(board[lastRow][botMoveCol] != Piece.Empty){              // For the new column, re-calculate the row that the piece will be dropped in
                lastRow--;
            }
        }
        if(lastRow-1 >= 0 && heurValue(board, lastRow-1, botMoveCol, Piece.PlayerTwo) >= 5){     // If true, dropping a piece lets the Player block Bot win their next turn
            hArray[botMoveCol] = 2;                                        // Reduce h value to 2, so that it's still better than letting Player win but still very low
            botMoveCol = maxArrValIndex(hArray);                           // Reset botMoveCol to the next best heuristic value
            lastRow = numRows - 1;
            while(board[lastRow][botMoveCol] != Piece.Empty){              // For the new column, re-calculate the row that the piece will be dropped in
                lastRow--;
            }
        }
        
        board[lastRow][botMoveCol] = Piece.PlayerTwo;         // Finally after all the checking and thinking, actually drop the piece
        
        turn = Piece.PlayerOne;                               // These three must be updated everytime a piece is dropped
        lastPieceRow = lastRow;
        lastPieceCol = botMoveCol;
    }
}