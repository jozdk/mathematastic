
// LocalStorage: Score

// Get Score

function getScore() {
    let score;
    if (localStorage.getItem("score") != null) {
        score = localStorage.getItem("score");
    } else {
        score = 0;
    }
    return score;
}

// Set Score

function setScore() {
    let newScore = Number(getScore()) + 1;
    localStorage.setItem("score", newScore);
}

/*function setScore(score) {
    localStorage.setItem("score", score);
}*/

// Clear Score

function clearScore() {
    localStorage.removeItem("score");
}


// LocalStorage: Current question

function getCurrentQuestion() {
    let currentQuestion;
    if (localStorage.getItem("currentQuestion") == null) {
        currentQuestion = null;
    } else {
        currentQuestion = JSON.parse(localStorage.getItem("currentQuestion"));
        console.log(currentQuestion);
    }
    return currentQuestion;
}

function setCurrentQuestion(arithProblem) {
    localStorage.setItem("currentQuestion", JSON.stringify(arithProblem));
}

function clearCurrentQuestion() {
    if (getCurrentQuestion != null) {
        localStorage.removeItem("currentQuestion");
    }

}

// LocalStorage: Best Times

function getBestTimes() {
    if (localStorage.getItem("bestTimes") == null) {
        console.log("getBestTimes denkt, es ist nichts im localStorage");
        return null;
    } else {
        let bestTimes = JSON.parse(localStorage.getItem("bestTimes"));
        console.log(bestTimes);
        return bestTimes;
    }
}

function setBestTimes(finishTime) {
    let bestTimes = getBestTimes();
    console.log(bestTimes);
    if (finishTime != null) {
        if (bestTimes == null) {
            console.log("setBestTimes denkt, da sind null bestTimes");
            bestTimes = [finishTime];
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        } else {
            bestTimes.push(finishTime);
            bestTimes.sort((a, b) => a - b);
            if (bestTimes.length > 5) {
                bestTimes.pop();
            }
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        }
    }

}

function clearBestTimes() {
    if (getBestTimes() != null) {
        // LocalStorage
        console.log("best times deleted");
        localStorage.removeItem("bestTimes");

    }

}

// LocalStorage: Timer Values

function getTimerValues() {
    let timerValues = JSON.parse(localStorage.getItem("timerValues"));
    return timerValues;
}

function setTimerValues(splitTime, running, paused) {
    localStorage.setItem("timerValues", JSON.stringify([splitTime, running, paused]));
}

function clearTimerValues() {
    localStorage.removeItem("timerValues");
}

// Generate arithmetic problem

var arithProblem;

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

    if (operator == "&divide;") {
        while (zahl1 % zahl2 != 0 || zahl1 == 0 || zahl2 < 2 || zahl2 > 11 || zahl1 / zahl2 == 1) {
            zahl1 = getRandomInt();
            zahl2 = getInt1to10();
        }
    }

    if (operator == "&times;" && zahl2 > 10) {
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
        default:
            console.log("problem");
            break;
    }
    console.log(result);
    console.log(inputResult);
    if (result == inputResult) {
        pauseTimer();
        console.log("true");
        displayAlert(true);
        setScore();
        clearCurrentQuestion();
        displayScore();
        input.blur();
        return true;
    } else {
        console.log("false");
        displayAlert(false);
        return false;
    }
}

// UI

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
const icons = document.querySelector("#svg-icons");

let hasBeenGenerated = false;
let hasBeenSubmitted = false;


// Display question

function formHidden(value) {
    form.hidden = value;
    input.hidden = value;
    send.hidden = value;
}

function removeQuestion() {
    if (span.innerHTML != "") {
        span.innerHTML = "";
        formHidden(true);
    }

    removeAlert();
}

function removeAlert() {
    if (icons.firstElementChild.style.visibility === "visible") {
        icons.firstElementChild.style.visibility = "collapse";
    }

    if (icons.lastElementChild.style.visibility === "visible") {
        icons.lastElementChild.style.visibility = "collapse";
    }

    if (message.innerHTML !== "") {
        message.innerHTML = "";
    }

    if (alerts.childNodes[0].tagName === "P" ) {
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

const success = ["Super!", "Allererste Sahne!", "Genial!", "Spitzenmäßig!", "Weiter so!"];
const fail = ["Faaaaalsch!", "Vielleicht beim nächsten Mal!", "Das kannst du besser!", "Versuch's nochmal!", "Sei kein Mathe-Muffel!"]

function displayAlert(correct) {
    // const success = document.createTextNode("Super!");
    // const check = document.createElement("img");
    // check.src = "Images/checkmark.png";
    // const fail = document.createTextNode("Faaaaalsch!");
    let random = Math.floor(Math.random() * 5);
    
    removeAlert();

    if (correct) {
        // alerts.appendChild(check);
        // alerts.appendChild(success);
        // alerts.innerHTML = `<img src='Images/checkmark.png'> <br> ${success[random]}`;
        // alerts.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>`;
        icons.firstElementChild.style.visibility = "visible";
        message.innerHTML = `${success[random]}`;
        

        hasBeenSubmitted = true;
        hasBeenGenerated = false;
    } else {
        // alerts.innerHTML = "<img src='Images/cross.png'> <br> Faaaaalsch!";
        // alerts.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11 cross" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg> <br> ${fail[random]}`;
        // alerts.appendChild(fail);
        icons.lastElementChild.style.visibility = "visible";
        message.innerHTML = `${fail[random]}`;
    }

}


// Display Score

const boxes = document.querySelectorAll(".box");

/* function displayScore() {
    let score = Number(getScore());
    let arr = Array.from(boxes);
    if(score === 0) {
        move.value = "New Game";
    }
    for(let box of arr) {
        if(Number(box.innerHTML) === score) {
            clearFields();
            box.classList.add("orange");
            if(Number(box.innerHTML) === 1) {
                console.log(box.innerHTML);
                move.value = "Move";
            } 
                      
        }
    }    
 
} */

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


    if (score == 0) {
        move.value = "New Game";
    } else {
        move.value = "Move";
    }

    if (score >= 9) {
        let congratulations = document.createElement("p");
        let textNode = document.createTextNode("Herzlichen Glückwunsch!");
        congratulations.appendChild(textNode);
        alerts.insertBefore(congratulations, alerts.childNodes[0]);

        message.innerHTML = "Das war <br> <b><span>M</span>athema<span>t</span>astic</b>!";
        // finishMessage.innerHTML = "Herzlichen Glückwunsch!"
        
        if (icons.firstElementChild.style.visibility !== "visible") {
            icons.firstElementChild.style.visibility = "visible";
        }
        console.log(savedTime);
        setBestTimes(savedTime);

        // newGame();

    }

    if (currentQuestion != null) {
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

let tInterval;
let startTime;
let updatedTime;
let difference;
let stopTime;
let savedTime;

let running = false;
let paused = false;

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

    }, 1);

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

        console.log(savedTime);

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
        console.log(timerValues);
        let time = convertMilliseconds(savedTime);
        timeOutput.innerHTML = `${time[0]}:${time[1]}:${time[2]}`;
        if (!paused && running) {
            startTimer();
        }

    }
}

// Event: Load score & Timer values

document.addEventListener("DOMContentLoaded", () => {
    displayScore();
    refreshTimerValues();
});

// Event: Move

move.addEventListener("click", () => {
    const score = getScore();
    if (hasBeenGenerated == false && score < 9) {
        displayQuestion();
        startTimer();
        hasBeenGenerated = true;
    } else {
        input.focus();
    }

});

window.addEventListener("keydown", (event) => {
    if (event.target.id !== "inputResult" && event.key === "Enter" ) {
        console.log("Element that triggered event: " + event.target.nodeName + event.target.id);
        const score = getScore();
        if (hasBeenGenerated == false && score < 9) {
            displayQuestion();
            startTimer();
            hasBeenGenerated = true;
        } else {
            input.focus();
        }
    }
})


// Event: Submit Result

// form.addEventListener("submit", (event) => {
//     event.preventDefault();
//     if (hasBeenSubmitted == false) {
//         validate(arithProblem, input.value);
//     }
// });

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        console.log("Element that triggered event: " + event.target.id);
        if (hasBeenSubmitted == false) {
            validate(arithProblem, input.value);
        }
    } 
});

// Event: Reset

reset.addEventListener("click", newGame);

window.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        newGame();
    }
})

// Event: Save Timer values to LocalStorage

window.addEventListener("beforeunload", () => {
    if (!paused && running) {
        clearInterval(tInterval);
        stopTime = Date.now();

        if (savedTime != null) {
            savedTime += stopTime - startTime;
        } else {
            savedTime = stopTime - startTime;
        }
    }
    setTimerValues(savedTime, running, paused);
});


// Modal

const openRanking = document.querySelector("#open-ranking");
const modalRanking = document.querySelector("#bt-modal");
const closeRanking = document.querySelector("#close-best-times");
const olRanking = document.querySelector("#best-times");
const ranking = document.querySelector("#bt-modal-body");
const clear = document.querySelector("#clear-best-times");

openRanking.addEventListener("click", () => {
    displayRanking();
    modalRanking.style.display = "block";
});

closeRanking.addEventListener("click", () => modalRanking.style.display = "none");

window.addEventListener("click", (event) => {
    if (event.target == modalRanking) {
        modalRanking.style.display = "none";
    }
});

function displayRanking() {
    let bestTimes = getBestTimes();
    console.log("displayRanking hat: " + bestTimes);
    if (bestTimes) {
        ranking.firstElementChild.innerHTML = "";
        let time;
        let output = "";
        bestTimes.forEach(i => {
            time = convertMilliseconds(i);
            output += `<li> ${time[0]}:${time[1]}:${time[2]} </li>`;
        });

        olRanking.innerHTML = output;

        // for(let i of bestTimes) {
        //     olRanking.innerHTML = `<li> ${i} </li>`;
        // }
    } else {
        olRanking.innerHTML = "";
        ranking.firstElementChild.innerHTML = "There are no personal best times yet.";
    }
}


clear.addEventListener("click", () => {
    clearBestTimes();
    displayRanking();
});
