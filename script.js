document.addEventListener('DOMContentLoaded', (event) => {
    const cards = document.querySelectorAll('.card');
    const timeRemainingDisplay = document.getElementById('time-remaining');
    const flipsDisplay = document.getElementById('flips'); // The element to display flips count
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let gameStarted = false;
    let gameTime = 60; // Game time in seconds
    let gameTimer;
    let flips = 0; // Counter for successful flips (matches)
    let matches = 0; // Counter for matches
    const totalPairs = cards.length / 2; // Total pairs of cards

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('is-flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;

            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
        } else {
            hasFlippedCard = false;
            secondCard = this;
            checkForMatch();
        }
    }

    function startTimer() {
        gameTime = 60;
        timeRemainingDisplay.textContent = gameTime;

        gameTimer = setInterval(() => {
            gameTime--;
            timeRemainingDisplay.textContent = gameTime;

            if (gameTime <= 0) {
                clearInterval(gameTimer);
                resetGame();
            }
        }, 1000);
    }

    function resetGame() {
        clearInterval(gameTimer);
        cards.forEach(card => {
            card.classList.remove('is-flipped');
            card.addEventListener('click', flipCard);
        });
        shuffleCards();
        revealCardsBriefly();
        [hasFlippedCard, lockBoard, gameStarted] = [false, false, false];
        flips = 0; // Reset the flips counter
        flipsDisplay.textContent = flips; // Update the flips display
        matches = 0; // Reset the matches counter
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        
        if (isMatch) {
            disableCards();
            flips++;
            flipsDisplay.textContent = flips;
            matches++;
            if (matches === totalPairs) {
                clearInterval(gameTimer);
                handleVictory();
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('is-flipped');
            secondCard.classList.remove('is-flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
    }

    function shuffleCards() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 12);
            card.style.order = randomPos;
        });
    }

    function revealCardsBriefly() {
        cards.forEach(card => card.classList.add('is-flipped'));
        
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('is-flipped'));
        }, 5000);
    }

    function handleVictory() {
        console.log("You've matched all the cards!");
        // Add more victory handling here if desired
    }

    cards.forEach(card => card.addEventListener('click', flipCard));

    shuffleCards();
    revealCardsBriefly();
});

