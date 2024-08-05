// script.js
document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const piecesContainer = document.getElementById("pieces");
    const message = document.getElementById("message");
    const scoreElement = document.getElementById("score");
    const resetButton = document.getElementById("resetButton");
    const hintButton = document.getElementById("hintButton");
    let draggingPiece = null;
    let score = 0;
    let hintsLeft = 5;

    const N = 8;
    const queens = Array(N).fill(null).map(() => document.createElement("div"));
    const boardState = Array.from({ length: N }, () => Array(N).fill(0));

    const correctPositions = [
        [0, 0], [1, 4], [2, 7], [3, 5], [4, 2], [5, 6], [6, 1], [7, 3]
    ];

    function createBoard() {
        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                const cell = document.createElement("div");
                cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("dragover", handleDragOver);
                cell.addEventListener("drop", handleDrop);
                board.appendChild(cell);
            }
        }
    }

    function createPieces() {
        queens.forEach((queen, index) => {
            queen.classList.add("piece");
            queen.draggable = true;
            queen.innerHTML = '<i class="fa-solid fa-chess-queen"></i>';
            queen.addEventListener("dragstart", handleDragStart);
            queen.addEventListener("dragend", handleDragEnd);
            piecesContainer.appendChild(queen);
        });
    }

    function handleDragStart(e) {
        draggingPiece = e.target;
        setTimeout(() => (draggingPiece.classList.add("dragging")), 0);
    }

    function handleDragEnd() {
        draggingPiece.classList.remove("dragging");
        draggingPiece = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (isSafe(row, col)) {
            placeQueen(row, col);
            updateScore(10); // Ganha 10 pontos a cada movimento correto
            if (queens.every(q => q.dataset.row !== undefined)) {
                message.textContent = `Parabéns! Você encontrou uma solução. Pontuação final: ${score}`;
                disableControls();
            }
        } else {
            e.target.classList.add("under-attack");
            setTimeout(() => e.target.classList.remove("under-attack"), 1000);
        }
    }

    function isSafe(row, col) {
        for (let i = 0; i < N; i++) {
            if (boardState[i][col] === 1 || boardState[row][i] === 1) {
                return false;
            }
        }
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (Math.abs(i - row) === Math.abs(j - col) && boardState[i][j] === 1) {
                    return false;
                }
            }
        }
        return true;
    }

    function placeQueen(row, col) {
        const previousRow = draggingPiece.dataset.row;
        const previousCol = draggingPiece.dataset.col;

        if (previousRow !== undefined && previousCol !== undefined) {
            boardState[previousRow][previousCol] = 0;
        }

        draggingPiece.dataset.row = row;
        draggingPiece.dataset.col = col;
        boardState[row][col] = 1;

        const targetCell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        targetCell.appendChild(draggingPiece);
    }

    function resetBoard() {
        queens.forEach(queen => {
            piecesContainer.appendChild(queen);
            delete queen.dataset.row;
            delete queen.dataset.col;
        });
        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                boardState[row][col] = 0;
            }
        }
        score = 0;
        hintsLeft = 5;
        updateScore(0);
        updateHintsLeft();
        message.textContent = '';
        enableControls();
    }

    function showHints() {
        if (hintsLeft > 0) {
            updateScore(-10); // Perde 10 pontos ao usar a dica
            hintsLeft--;
            updateHintsLeft();
            correctPositions.forEach(([row, col]) => {
                const queen = queens.find(q => q.dataset.row == row && q.dataset.col == col);
                if (!queen) {
                    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add("hint");
                }
            });
            setTimeout(() => {
                document.querySelectorAll(".hint").forEach(cell => cell.classList.remove("hint"));
            }, 2000);
        }
    }

    function updateScore(change) {
        score += change;
        scoreElement.textContent = `Pontuação: ${score}`;
    }

    function updateHintsLeft() {
        hintButton.textContent = `Mostrar Dica (${hintsLeft})`;
    }

    function disableControls() {
        queens.forEach(queen => {
            queen.draggable = false;
        });
        hintButton.disabled = true;
    }

    function enableControls() {
        queens.forEach(queen => {
            queen.draggable = true;
        });
        hintButton.disabled = false;
    }

    resetButton.addEventListener("click", resetBoard);
    hintButton.addEventListener("click", showHints);

    createBoard();
    createPieces();
    updateHintsLeft();
});
