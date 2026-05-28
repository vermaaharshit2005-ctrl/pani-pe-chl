const questions = [
    {
        question: "Which of the following produces the majority of Earth's oxygen?",
        answers: [
            { text: "Amazon Rainforest", correct: false },
            { text: "Ocean Phytoplankton (Marine Plants)", correct: true },
            { text: "Grasslands", correct: false },
            { text: "Boreal Forests", correct: false }
        ]
    },
    {
        question: "Approximately how much plastic waste enters the ocean every year?",
        answers: [
            { text: "1 Million Tons", correct: false },
            { text: "500,000 Tons", correct: false },
            { text: "8 Million Tons", correct: true },
            { text: "20 Million Tons", correct: false }
        ]
    },
    {
        question: "What is the main cause of Ocean Acidification?",
        answers: [
            { text: "Excessive Carbon Dioxide (CO2) absorption", correct: true },
            { text: "Oil Spills", correct: false },
            { text: "Plastic pollution", correct: false },
            { text: "Overfishing", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next Question ➔";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("quiz-btn");
        answerButtonsElement.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while(answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
    }
    
    Array.from(answerButtonsElement.children).forEach(button => {
        if(button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "inline-block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `🎉 Quiz Completed! Your Score: ${score} out of ${questions.length}`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "inline-block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();