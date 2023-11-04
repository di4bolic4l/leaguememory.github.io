document.addEventListener('DOMContentLoaded', (event) => {
    const cards = document.querySelectorAll('.card');
    const timeRemainingDisplay = document.getElementById('time-remaining');
    const flipsDisplay = document.getElementById('flips');
    const personalRecordDisplay = document.getElementById('personal-record');
    let hasFlippedCard = false;
    let lockBoard = true; // Initially lock the board during the reveal
    let firstCard, secondCard;
    let gameStarted = false;
    let gameTime = 60;
    let gameTimer;
    let flips = 0;
    let matches = 0;
    const totalPairs = cards.length / 2;

    loadAndDisplayRecord();

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
            secondCard = this;

            if (gameStarted) {
                flips++;
                flipsDisplay.textContent = flips;
            }

            checkForMatch();
            hasFlippedCard = false;
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
        cards.forEach(card => card.classList.remove('is-flipped'));
        shuffleCards();
        revealCardsBriefly();
        [hasFlippedCard, lockBoard, gameStarted] = [false, true, false]; // Reset and lock the board
        flips = 0;
        flipsDisplay.textContent = flips;
        matches = 0;
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        matches++;
        if (matches === totalPairs) {
            clearInterval(gameTimer);
            handleVictory();
        }

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
            let randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
        });
    }

    function revealCardsBriefly() {
        cards.forEach(card => card.classList.add('is-flipped'));

        setTimeout(() => {
            cards.forEach(card => card.classList.remove('is-flipped'));
            lockBoard = false; // Now allow cards to be clicked
        }, 5000);
    }

    function handleVictory() {
        console.log("You've matched all the cards!");
        checkAndSetRecord();
    }

    function checkAndSetRecord() {
        const previousRecord = localStorage.getItem('userRecord');
        const currentRecord = { flips, time: gameTime };

        if (!previousRecord || 
            flips < JSON.parse(previousRecord).flips || 
            (flips === JSON.parse(previousRecord).flips && gameTime > JSON.parse(previousRecord).time)) {
            localStorage.setItem('userRecord', JSON.stringify(currentRecord));
            loadAndDisplayRecord();
            alert('New record set!');
        }
    }

    function loadAndDisplayRecord() {
        const record = localStorage.getItem('userRecord');
        if (record) {
            const { flips, time } = JSON.parse(record);
            personalRecordDisplay.textContent = `${flips} Flips, ${time} Sec`;
        } else {
            personalRecordDisplay.textContent = 'No record yet';
        }
    }

    cards.forEach(card => card.addEventListener('click', flipCard));
    shuffleCards();
    revealCardsBriefly();
});
