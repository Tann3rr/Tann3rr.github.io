const board = document.getElementById('board');
const status = document.querySelector('.status');
const restartBtn = document.querySelector('.restart-btn');

const X_CLASS = 'x';
const O_CLASS = 'o';
let currentClass;
let aiTurn = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = Array.from(document.querySelectorAll('.cell'));

startGame();

restartBtn.addEventListener('click', startGame);

function startGame() {
    aiTurn = false;
    currentClass = X_CLASS;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    status.innerText = "User's Turn";
}

function handleClick(e) {
    const cell = e.target;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (aiTurn) {
            status.innerText = "AI's Turn";
            setTimeout(aiTurnLogic, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function aiTurnLogic() {
    const bestMove = minimax(cells, O_CLASS).index;
    placeMark(cells[bestMove], O_CLASS);

    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        status.innerText = "User's Turn";
    }
}

function endGame(draw) {
    status.innerText = draw ? "It's a Draw!" : `${currentClass === X_CLASS ? "User" : "AI"} Wins!`;
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function isDraw() {
    return cells.every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS));
}

function swapTurns() {
    currentClass = currentClass === X_CLASS ? O_CLASS : X_CLASS;
    aiTurn = !aiTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => cells[index].classList.contains(currentClass));
    });
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (aiTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    
    if (checkWin(O_CLASS)) {
        return { score: 10 };
    } else if (checkWin(X_CLASS)) {
        return { score: -10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }
    
    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = newBoard.indexOf(availableSpots[i]);
        
        newBoard[move.index].classList.add(player);
        
        if (player === O_CLASS) {
            const result = minimax(newBoard, X_CLASS);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, O_CLASS);
            move.score = result.score;
        }
        
        newBoard[move.index].classList.remove(player);
        moves.push(move);
    }
    
    let bestMove;
    if (player === O_CLASS) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}
