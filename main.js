// HTML Elements

// UI Elements

const display = document.querySelector("#displayQuestion");
const alerts = document.querySelector("#displayAlert");
const form = document.querySelector("#form");
const input = document.querySelector("#inputResult");
const send = document.querySelector(".send");
const span = document.querySelector("#span");
const move = document.querySelector(".move");
const reset = document.querySelector(".reset");
const timeOutput = document.querySelector("#stopwatch");
const message = document.querySelector("#message")
const finishMessage = document.querySelector("#finish-message");
const boxes = document.querySelectorAll(".box");
const icons = document.querySelector("#svg-icons");
const successIcon = document.querySelector("#success-icon");
const failIcon = document.querySelector("#fail-icon");

// Modal Elements

const openRanking = document.querySelector("#open-ranking");
const modalRanking = document.querySelector("#bt-modal");
const closeRanking = document.querySelector("#close-best-times");
const olRanking = document.querySelector("#best-times");
const ranking = document.querySelector("#bt-modal-body");
const clear = document.querySelector("#clear-best-times");

// Global Variables

const success = ["Super!", "Allererste Sahne!", "Genial!", "Spitzenmäßig!", "Weiter so!"];
const fail = ["Faaaaalsch!", "Pech gehabt!", "Das kannst du besser!", "Versuch's nochmal!", "Sei kein Mathe-Muffel!"]

let arithProblem;
let hasBeenGenerated = false;
let hasBeenSubmitted = false;

// Timer Variables

let tInterval;
let startTime;
let updatedTime;
let difference;
let stopTime;
let savedTime;

let running = false;
let paused = false;

// Set CSS Variable

document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);

// Local Storage: Score

function getScore() {
    return Number(localStorage.getItem("score")) || 0;
}

function setScore() {
    localStorage.setItem("score", getScore() + 1);
}

function clearScore() {
    localStorage.removeItem("score");
}

// Local Storage: Current question

function getCurrentQuestion() {
    return JSON.parse(localStorage.getItem("currentQuestion"));
}

function setCurrentQuestion(arithProblem) {
    localStorage.setItem("currentQuestion", JSON.stringify(arithProblem));
}

function clearCurrentQuestion() {
    if (getCurrentQuestion()) {
        localStorage.removeItem("currentQuestion");
    }

}

// Local Storage: Best Times

function getBestTimes() {
    return JSON.parse(localStorage.getItem("bestTimes"));
}

function setBestTimes(finishTime) {
    let bestTimes = getBestTimes();
    if (finishTime) {
        if (bestTimes === null) {
            bestTimes = [finishTime];
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        } else {
            bestTimes.push(finishTime);
            bestTimes.sort((a, b) => a - b);
            if (bestTimes.length > 10) {
                bestTimes.pop();
            }
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        }
    }

}

function clearBestTimes() {
    if (getBestTimes() !== null) {
        console.log("best times deleted");
        localStorage.removeItem("bestTimes");
    }
}

// Local Storage: Timer Values

function getTimerValues() {
    return JSON.parse(localStorage.getItem("timerValues"));
}

function setTimerValues(splitTime, running, paused) {
    localStorage.setItem("timerValues", JSON.stringify([splitTime, running, paused]));
}

function clearTimerValues() {
    localStorage.removeItem("timerValues");
}

// Generate arithmetic problem

function getRandomInt() {
    return Math.floor(Math.random() * (100 - 2) + 2);
}

function getInt1to10() {
    return Math.floor(Math.random() * (11 - 2) + 2);
}

function chooseOperator() {
    const operators = ["+", "-", "&times;", "&divide;"];
    const i = Math.floor(Math.random() * 4);
    return operators[i];
}

function generate() {
    let zahl1 = getRandomInt();
    let operator = chooseOperator();
    let zahl2 = getRandomInt();

    if (operator === "&divide;") {
        while (zahl1 % zahl2 !== 0 || zahl2 < 2 || zahl2 > 11 || zahl1 / zahl2 === 1) {
            zahl1 = getRandomInt();
            zahl2 = getInt1to10();
        }
    }

    if (operator === "&times;" && zahl2 > 10) {
        zahl2 = getInt1to10();
    }

    arithProblem = [zahl1, zahl2, operator]

}

// Validate result

function validate(arithProblem, inputResult) {
    let result;
    let num1, num2, opt;
    [num1, num2, opt] = arithProblem;
    switch (opt) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "&times;":
            result = num1 * num2;
            break;
        case "&divide;":
            result = num1 / num2;
            break;
    }
    if (result === inputResult) {
        pauseTimer();
        displayAlert(true);
        setScore();
        clearCurrentQuestion();
        displayScore();
        input.blur();
        return true;
    } else {
        displayAlert(false);
        return false;
    }
}

// UI

// Display question

function formHidden(value) {
    form.hidden = value;
    input.hidden = value;
    send.hidden = value;
}

function removeQuestion() {
    if (span.innerHTML !== "") {
        span.innerHTML = "";
        formHidden(true);
    }

    removeAlert();
}

function removeAlert() {
    if (successIcon.style.display === "inline") {
        successIcon.style.display = "";
    }

    if (failIcon.style.display === "inline") {
        failIcon.style.display = "";
    }

    if (message.innerHTML !== "") {
        message.innerHTML = "";
    }

    if (alerts.childNodes[0].tagName === "P") {
        alerts.childNodes[0].remove();
    }
}

function displayQuestion() {
    input.value = "";
    removeQuestion();
    generate();
    span.innerHTML = `${arithProblem[0]} ${arithProblem[2]} ${arithProblem[1]} = `;
    formHidden(false);
    input.focus();
    setCurrentQuestion(arithProblem);
    hasBeenSubmitted = false;
}

// Success/Fail Alert

function displayAlert(correct) {

    removeAlert();

    if (correct) {
        successIcon.style.display = "inline";
        message.innerHTML = `${success[Math.floor(Math.random() * success.length)]}`;
        hasBeenSubmitted = true;
        hasBeenGenerated = false;
    } else {
        failIcon.style.display = "inline";
        message.innerHTML = `${fail[Math.floor(Math.random() * fail.length)]}`;
    }

}

// Display Score

function displayScore() {

    let currentQuestion = getCurrentQuestion();
    let score = getScore();
    let currentBox = ".box" + score;
    let previousBox = ".box" + (score - 1);

    if (score > 0 && score <= 9) {
        document.querySelector(currentBox).classList.add("orange");
    }
    if (score >= 2 && score <= 9) {
        document.querySelector(previousBox).classList.remove("orange");
    }

    if (score === 0) {
        move.value = "New Game";
    } else {
        move.value = "Move";
    }

    if (score >= 9) {

        let congratulations = document.createElement("p");
        let textNode = document.createTextNode("Herzlichen Glückwunsch!");
        congratulations.appendChild(textNode);
        congratulations.classList.add("congrats-medium");
        alerts.insertBefore(congratulations, alerts.childNodes[0]);

        message.innerHTML = "Das war <br> <b><span>M</span>athema<span>t</span>astic</b>!";

        if (successIcon.style.display !== "inline") {
            successIcon.style.display = "inline";
        }

        setBestTimes(savedTime);
    }

    if (currentQuestion) {
        arithProblem = currentQuestion;
        span.innerHTML = `${arithProblem[0]} ${arithProblem[2]} ${arithProblem[1]} = `;
        formHidden(false);
        input.focus();
        hasBeenSubmitted = false;
        hasBeenGenerated = true;
    }

}

// Clear Fields

function clearFields() {
    let nodeList = document.querySelectorAll(".box");
    nodeList.forEach((box) => {
        if (box.classList.contains("orange")) {
            box.classList.remove("orange");
        }
    });
}

// New Game

function newGame() {
    clearScore();
    clearCurrentQuestion();
    clearTimer();
    removeQuestion();
    displayScore();
    clearFields();
    hasBeenGenerated = false;
}

// Timer

function convertMilliseconds(ms) {
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let seconds = Math.floor((ms / 1000) % 60);
    let milliseconds = Math.floor(ms % 1000);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    if (milliseconds < 10) {
        milliseconds = "00" + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = "0" + milliseconds;
    }

    return [minutes, seconds, milliseconds];
}

function startTimer() {
    startTime = Date.now();
    tInterval = setInterval(() => {
        updatedTime = Date.now();
        if (savedTime) {
            difference = (updatedTime - startTime) + savedTime;
        } else {
            difference = updatedTime - startTime;
        }

        let time = convertMilliseconds(difference);

        timeOutput.innerHTML = `${time[0]}:${time[1]}:${time[2]}`;

    }, 10);

    running = true;
    paused = false;

}

function pauseTimer() {
    if (!running && !paused) {

    }
    else if (!paused) {
        clearInterval(tInterval);
        stopTime = Date.now();

        if (savedTime != null) {
            savedTime += stopTime - startTime;
        } else {
            savedTime = stopTime - startTime;
        }

        let time = convertMilliseconds(savedTime);

        timeOutput.innerHTML = `${time[0]}:${time[1]}:${time[2]}`;

        paused = true;
        running = false;

    } else {
        startTimer();
    }

}

function clearTimer() {
    clearInterval(tInterval);
    savedTime = null;
    running = false;
    paused = false;
    timeOutput.innerHTML = "00:00:000";
    clearTimerValues();
}

function refreshTimerValues() {
    let timerValues = getTimerValues();
    if (timerValues) {
        savedTime = timerValues[0];
        running = timerValues[1];
        paused = timerValues[2];
        let time = convertMilliseconds(savedTime);
        timeOutput.innerHTML = `${time[0]}:${time[1]}:${time[2]}`;
        if (!paused && running) {
            startTimer();
        }

    }
}

// Personal Best Times

function displayRanking() {
    let bestTimes = getBestTimes();

    if (bestTimes) {
        ranking.firstElementChild.innerHTML = "";
        let time;
        let output = "";

        bestTimes.forEach(i => {
            time = convertMilliseconds(i);
            output += `<li> ${time[0]}:${time[1]}:${time[2]} </li>`;
        });

        olRanking.innerHTML = output;
    } else {
        olRanking.innerHTML = "";
        ranking.firstElementChild.innerHTML = "There are no personal best times yet.";
    }
}

// Event handling

// Load score & Timer values

document.addEventListener("DOMContentLoaded", () => {
    displayScore();
    refreshTimerValues();
});

// Move

move.addEventListener("click", () => {
    const score = getScore();
    if (!hasBeenGenerated && score < 9) {
        displayQuestion();
        startTimer();
        hasBeenGenerated = true;
    } else {
        input.focus();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.target.id !== "inputResult" && event.key === "Enter") {
        const score = getScore();
        if (!hasBeenGenerated && score < 9) {
            displayQuestion();
            startTimer();
            hasBeenGenerated = true;
        } else {
            input.focus();
        }
    }
})

// Submit Result

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (!hasBeenSubmitted) {
            validate(arithProblem, Number(input.value));
        }
    }
});

send.addEventListener("click", () => {
    if (!hasBeenSubmitted) {
        validate(arithProblem, Number(input.value));
    }
})

// Reset

reset.addEventListener("click", newGame);

window.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        newGame();
    }
})

// Save Timer Values to Local Storage

window.addEventListener("beforeunload", () => {
    if (!paused && running) {
        clearInterval(tInterval);
        stopTime = Date.now();

        if (savedTime) {
            savedTime += stopTime - startTime;
        } else {
            savedTime = stopTime - startTime;
        }
    }
    setTimerValues(savedTime, running, paused);
});

window.addEventListener("resize", () => {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
})

// Open, Close & Delete Personal Best Times

openRanking.addEventListener("click", () => {
    displayRanking();
    modalRanking.style.display = "block";
});

closeRanking.addEventListener("click", () => modalRanking.style.display = "none");

window.addEventListener("click", (event) => {
    if (event.target === modalRanking) {
        modalRanking.style.display = "none";
    }
});

clear.addEventListener("click", () => {
    clearBestTimes();
    displayRanking();
});