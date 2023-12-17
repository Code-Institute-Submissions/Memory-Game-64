const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const cardCount = document.querySelector("#total-count");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    { name: "bee", image: "bee.png" },
    { name: "crocodile", image: "crocodile.png" },
    { name: "macaw", image: "macaw.png" },
    { name: "gorilla", image: "gorilla.png" },
    { name: "tiger", image: "tiger.png" },
    { name: "monkey", image: "monkey.png" },
    { name: "chameleon", image: "chameleon.png" },
    { name: "piranha", image: "piranha.png" },
    { name: "anaconda", image: "anaconda.png" },
    { name: "sloth", image: "sloth.png" },
    { name: "cockatoo", image: "cockatoo.png" },
    { name: "toucan", image: "toucan.png" },
];

//Initial Time
let seconds = 0,
    minutes = 0;
//Initial moves and win count
let movesCount = 0,
    winCount = 0;

//For timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

// Add a canClick variable
let canClick = true;
let cardMatchCount = 0;

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
                    Create Cards
                    before => front side (contains question mark)
                    after => back side (contains actual image);
                    data-card-values is a custom attribute which stores the names of the cards to match later
                  */
        gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="assets/images/${cardValues[i].image}" class="image"/></div>
     </div>
     `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
            if (!card.classList.contains("matched") && canClick) {
                // Flip the clicked card
                card.classList.add("flipped");

                // If it is the first card (!firstCard since firstCard is initially false)
                if (!firstCard) {
                    // So the current card will become firstCard
                    firstCard = card;
                    // Current card's value becomes firstCardValue
                    firstCardValue = card.getAttribute("data-card-value");
                } else if (card !== firstCard) {
                    // Increment moves since the user selected the second card
                    movesCounter();
                    // SecondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");

                    if (firstCardValue == secondCardValue) {
                        // If both cards match, add matched class so these cards would be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");

                        // Card Match Count

                        const matched = document.querySelectorAll(".matched").length;

                        if (matched > 0 && matched % 2 == 0) {
                            cardMatchCount++;
                            cardCount.textContent = cardMatchCount;
                        }

                        // Set firstCard to false since the next card would be the first now
                        firstCard = false;
                        // WinCount increment as the user found a correct match
                        winCount += 1;
                        // Check if winCount == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        // If the cards don't match
                        // Flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        canClick = false; // Disable further clicks temporarily
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                            canClick = true; // Re-enable clicks after the cards are flipped back
                        }, 700);
                    }
                }
            }
        });
    });
};

// Heading and Description

const heading = document.querySelector(".heading");
const description = document.querySelector(".description");

//Start game
startButton.addEventListener("click", () => {
    cardMatchCount = 0;
    cardCount.textContent = "0";
    heading.style.display = "none";
    description.style.display = "none";
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //controls amd buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //Start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

//Stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        cardCount.textContent = "0";
        cardMatchCount = 0;
        heading.style.display = "block";
        description.style.display = "block";
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);
//Initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
};
