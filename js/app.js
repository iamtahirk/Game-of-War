const newDeckButton = document.getElementById('newdeck');
const drawCardsButton = document.getElementById('drawcards');
const restartGameButton = document.getElementById('restart');

const playerCard = document.getElementById('playercard');
const computerCard = document.getElementById('computercard');

const gameTitleDisplay = document.getElementById('gametitle');

const remainingCardsDisplay = document.getElementById('remainingcards');

const currentWinner = document.getElementById('winner'); 

const playerScoreDisplay = document.getElementById('playerdrawswon');
const computerScoreDisplay = document.getElementById('computerdrawswon');


const url = 'https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/';
// Array to store all cards for later animation
let deckOfCards = [];
let deckID = '';
// To store Both Player Scores
let playerScore = 0;
let computerScore = 0;
// To stop the setInterval for animation
let animationInterval = null;


// function to fetch the deck
const fetchCards = async () => {
    gameTitleDisplay.classList.add('hideme');
    const response = await fetch (url);
    const data = await response.json();
    
    console.log(data);
    deckID = data.deck_id;
    console.log(deckID);
    remainingCardsDisplay.textContent = data.remaining;

    remainingCardsDisplay.parentElement.classList.remove('hideme');
    // Disable the button
    newDeckButton.classList.add('hideme');
    drawCardsButton.classList.remove('hideme');
}

// Function to fetch the cards based on the fetched deck ID
const drawCards = async () => {
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckID}/draw/?count=2`);
    const data = await response.json();

    if (data.remaining >= 0) {
        remainingCardsDisplay.textContent = data.remaining;
        
        console.log(data);
        console.log(data.cards);
        
        deckOfCards.push(data.cards[0].image);
        deckOfCards.push(data.cards[1].image);
        // console.log(deckOfCards);

        playerCard.src = data.cards[0].image;
        computerCard.src = data.cards[1].image;

        cardScore(data.cards[0].value, data.cards[1].value);
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;

        if (data.remaining === 0) {
            drawCardsButton.classList.add('hideme');
            cardsAnimation = true;
            setTimeout(() => {
                getWinner();
            }, 1800);
            
            animationInterval = setInterval(drawAnimation, 1500);
        }
    }
}

// Score Calculation
const cardScore = (cardOne, cardTwo) => {
    let cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];

    const cardOneValue = cardValues.indexOf(cardOne);
    const cardTwoValue = cardValues.indexOf(cardTwo);

    if (cardOneValue === cardTwoValue) {
        currentWinner.textContent = "👏 It's a Draw 👏";
    } else if (cardOneValue > cardTwoValue) {
        currentWinner.textContent = "🤺 Player Won! 🤺";
        playerScore++;
    } else {
        currentWinner.textContent = "🤖 Computer Won! 🤖";
        computerScore++;
    }
}

const getWinner = () => {
    if (playerScore === computerScore) {
        currentWinner.textContent = "👏 It's a DRAW. You both fought well! 👏"
    } else if (playerScore > computerScore)  {
        currentWinner.textContent = "🤺 Player Won the War! 🤺"
    } else {
        currentWinner.textContent = "🤖 Computer Won the War! 🤖"
    }

    currentWinner.classList.remove('winnertxt');
    currentWinner.classList.add('finalwinnertxt');

    playerCard.classList.add('playercardanimation');
    computerCard.classList.add('computercardanimation');
    
    drawCardsButton.classList.add('hideme');
    restartGameButton.classList.remove('hideme');
}

const restartGame = () => {
    clearInterval(animationInterval);
    
    playerScore = 0;
    computerScore = 0;

    playerScoreDisplay.textContent = '';
    computerScoreDisplay.textContent = '';

    playerCard.src = './images/card-game-48980.png';
    computerCard.src = './images/card-game-48983.png';

    restartGameButton.classList.add('hideme');
    gameTitleDisplay.classList.remove('hideme');
    remainingCardsDisplay.parentElement.classList.add('hideme');

    newDeckButton.classList.remove('hideme');
    playerCard.classList.remove('playercardanimation');
    computerCard.classList.remove('computercardanimation');
    currentWinner.classList.remove('finalwinnertxt');
    currentWinner.classList.add('winnertxt');
    currentWinner.textContent = "";
}

const drawAnimation = () => {
    let randomImgPlayer = deckOfCards[Math.floor(Math.random() * deckOfCards.length)];
    let randomImgComputer = deckOfCards[Math.floor(Math.random() * deckOfCards.length)];

    playerCard.src = randomImgPlayer;
    computerCard.src = randomImgComputer;
}

newDeckButton.addEventListener('click', fetchCards);
drawCardsButton.addEventListener('click', drawCards);
restartGameButton.addEventListener('click', restartGame);