let currentPlayer = 1;
let playerCount = 2;
let scores = {};
let playerNames = {};
let firstCard = null;
let secondCard = null;
let locked = false;
let matchedPairs = 0;

const emojis = ['😀', '😎', '😍', '🤔', '😴', '🤣', '😇', '🤩', '😋', '😜',
    '😺', '🎮', '🎨', '🎭', '🎪', '🎰', '🎲', '🎯', '🎱', '🎳',
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
    '🌈', '🌞', '🌙', '⭐', '🌟', '⚡', '☄️', '🌪️', '🌈', '🌍',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'
];

function generatePlayerInputs() {
    playerCount = parseInt(document.getElementById('playerCount').value) || 2;

    if (playerCount < 2) {
        alert('Please enter at least 2 players');
        return;
    }

    const playerNamesDiv = document.getElementById('playerNames');
    playerNamesDiv.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player${i}`;
        input.placeholder = `Player ${i} Name`;
        playerNamesDiv.appendChild(input);
    }
}

function startGame() {
    if (!document.getElementById('player1')) {
        alert('Please set the number of players first!');
        return;
    }

    // Get player names
    playerNames = {};
    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`player${i}`).value.trim();
        playerNames[i] = name || `Player ${i}`;
    }

    // Reset scores
    scores = {};
    for (let i = 1; i <= playerCount; i++) {
        scores[i] = 0;
    }

    currentPlayer = 1;
    matchedPairs = 0;
    createGrid(parseInt(document.getElementById('gridSize').value));
    updateStatus();
}

function createGrid(size) {
    const grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const viewportSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    const cardSize = (viewportSize / size) - 10;

    grid.innerHTML = '';

    let emojiPairs = [];
    for (let i = 0; i < (size * size) / 2; i++) {
        emojiPairs.push(emojis[i], emojis[i]);
    }
    emojiPairs = emojiPairs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < size * size; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = `${cardSize}px`;
        card.dataset.value = emojiPairs[i];
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    }
}

function flipCard(card) {
    if (locked || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.value;

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    locked = true;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        scores[currentPlayer]++;
        matchedPairs++;

        firstCard = null;
        secondCard = null;
        locked = false;

        if (matchedPairs === Math.pow(parseInt(document.getElementById('gridSize').value), 2) / 2) {
            const winner = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
            showWinnerPopup(winner);
            return;
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard = null;
            secondCard = null;
            locked = false;
            currentPlayer = currentPlayer % playerCount + 1;
            updateStatus();
        }, 1000);
    }

    updateStatus();
}

function updateStatus() {
    let statusText = `Player ${currentPlayer}'s turn | Scores: `;
    for (let i = 1; i <= playerCount; i++) {
        statusText += `${playerNames[i]}: ${scores[i]} | `;
    }
    document.getElementById('status').textContent = statusText.trim();
}

function showWinnerPopup(winner) {
    const winnerPopup = document.getElementById('winnerPopup');
    winnerPopup.classList.add('show');
    document.getElementById('winnerMessage').textContent = `Congratulations, ${playerNames[winner]} wins!`;
}

function closeWinnerPopup() {
    const winnerPopup = document.getElementById('winnerPopup');
    winnerPopup.classList.remove('show');
    startGame();
}