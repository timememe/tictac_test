const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const popup = document.getElementById('popup');
const winPopup = document.getElementById('win-popup');
const finalPopup = document.getElementById('final-popup');
const winMessage = document.getElementById('win-message');
const roundCounterText = document.getElementById('round-counter');
const finalMessage = document.getElementById('final-message');
const closeWinPopupButton = document.getElementById('close-win-popup');
const restartGameButton = document.getElementById('restart-game');
const startButton = document.getElementById('start');

let currentPlayer = 'X';
let gameActive = false;
let roundCounter = { player: 0, bot: 0, draw: 0 };
let roundsPlayed = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkWin = (player) => {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return cells[index].dataset.player === player;
        });
    });
};

const checkDraw = () => {
    return [...cells].every(cell => {
        return cell.dataset.player === 'X' || cell.dataset.player === 'O';
    });
};

const showWinPopup = (message) => {
    winMessage.textContent = message;
    roundCounterText.innerHTML = `Счет:<br>Игрок: ${roundCounter.player}<br>ИИ: ${roundCounter.bot}<br>Ничья: ${roundCounter.draw}`;
    winPopup.style.display = 'flex';
};

const showFinalPopup = () => {
    finalMessage.innerHTML = `Итоги игры:<br>Игрок: ${roundCounter.player}<br>ИИ: ${roundCounter.bot}<br>Ничья: ${roundCounter.draw}`;
    finalPopup.style.display = 'flex';
};

const handleCellClick = (e) => {
    if (!gameActive) return;

    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (cell.dataset.player) {
        return;
    }

    cell.dataset.player = currentPlayer;
    cell.innerHTML = `<img src="assets/back_${currentPlayer === 'X' ? 'cream' : 'nocream'}.png" alt="${currentPlayer}" class="appear">`;

    if (checkWin(currentPlayer)) {
        roundsPlayed++;
        roundCounter[currentPlayer === 'X' ? 'player' : 'bot']++;
        if (roundsPlayed >= 3) {
            showFinalPopup();
        } else {
            showWinPopup(`${currentPlayer} победил!`);
        }
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        roundsPlayed++;
        roundCounter.draw++;
        if (roundsPlayed >= 3) {
            showFinalPopup();
        } else {
            showWinPopup('Ничья!');
        }
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        setTimeout(botMove, 500);  // Delay AI move by 500ms
    }
};

const botMove = () => {
    const emptyCells = [...cells].filter(cell => !cell.dataset.player);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    cell.dataset.player = 'O';
    cell.innerHTML = `<img src="assets/back_nocream.png" alt="O" class="appear">`;

    if (checkWin('O')) {
        roundsPlayed++;
        roundCounter.bot++;
        if (roundsPlayed >= 3) {
            showFinalPopup();
        } else {
            showWinPopup('O победил!');
        }
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        roundsPlayed++;
        roundCounter.draw++;
        if (roundsPlayed >= 3) {
            showFinalPopup();
        } else {
            showWinPopup('Ничья!');
        }
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
};

const restartGame = () => {
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.dataset.player = '';
    });
    currentPlayer = 'X';
    gameActive = true;
};

const startGame = () => {
    popup.style.display = 'none';
    gameActive = true;
};

const closeWinPopup = () => {
    winPopup.style.display = 'none';
    if (roundsPlayed >= 3) {
        showFinalPopup();
    } else {
        restartGame();
    }
};

const restartFullGame = () => {
    finalPopup.style.display = 'none';
    roundCounter = { player: 0, bot: 0, draw: 0 };
    roundsPlayed = 0;
    restartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);
closeWinPopupButton.addEventListener('click', closeWinPopup);
restartGameButton.addEventListener('click', restartFullGame);

window.onload = () => {
    popup.style.display = 'flex';
};
