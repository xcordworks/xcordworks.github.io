const questionEl = document.getElementById("question");
const anagramEl = document.getElementById("anagram");
const nextBtn = document.getElementById("nextBtn");
const restartGame = document.getElementById("restartGame");
const answerEl = document.getElementById("answer");
const gameElement = document.getElementById("game");
const endOfGameElement = document.getElementById("endOfGame");

var answerTimer;
var usedQuestions = [];

let questionBankLength = Object.keys(quiz).length;

nextBtn.onclick = () => {

    loadQuestion();

};

restartGame.onclick = () => {

    usedQuestions = [];
    gameElement.style.display = "block";
    endOfGameElement.style.display = "none";

    loadQuestion();
};

function loadQuestion() {

    resetAnswer();
    // sleep(1000);
    let usedQuestionsLength = usedQuestions.length;

    let qObj = getRandomQuestion(quiz, usedQuestions);

    if (qObj) {

        usedQuestions.push(qObj.key);

        questionEl.innerText = qObj.data.question;
        anagramEl.innerHTML = qObj.data.anagram;

        startSlider(qObj.data.timer);
        let timerInMilliSeconds = qObj.data.timer * 1000;
        answerTimer = setTimeout(() => displayAnswer(qObj), timerInMilliSeconds);  // Set the time out to 7 seconds
    } else if (
        questionBankLength > 0 && usedQuestionsLength > 0
        && questionBankLength == usedQuestionsLength
    ) {
        displayEndOfGame();
    }
}

function displayEndOfGame() {
    gameElement.style.display = "none";
    endOfGameElement.style.display = "block";
}

function resetAnswer() {

    answerEl.innerText = '';
    answerEl.classList.remove("show");

    if (answerTimer) {
        clearTimeout(answerTimer);
    }
}

function displayAnswer(qObj) {
    answerEl.classList.remove("finished");
    answerEl.innerText = qObj.data.answer;

    // set dynamic steps
    answerEl.style.setProperty("--chars", qObj.data.answer.length);

    // reset state (important if reused)
    answerEl.classList.remove("show");
    void answerEl.offsetWidth; // force reflow (restart animation)

    // trigger animation
    answerEl.classList.add("show");


    // mark animation finished
    setTimeout(() => {
        answerEl.classList.add("finished");
    }, 1500); // match typing duration

}

function startSlider(seconds) {
    const card = document.getElementById("quizCard");
    const duration = seconds * 1000;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let percent = Math.min(progress / duration, 1);

        let angle = percent * 360;

        card.style.background = `conic-gradient(#4caf50 ${angle}deg, #ddd ${angle}deg)`;

        if (percent < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

loadQuestion();