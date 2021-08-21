let timer = 0;
let interval = 0;

const guideList = [
	"For each question you have only 20 seconds.",
	"Once you select your answer, It CAN NOT be undone!",
	"For every correct answer you will get 1 Point.",
	"You CAN NOT exit from the Quiz while you are playing."
];

let state = {
	questions: [
		{
			text: 'What is one quarter of 1,000?',
			answers: [
				{ choice: '250', correct: true },
				{ choice: '255', correct: false },
				{ choice: '225', correct: false },
				{ choice: '205', correct: false }
			]
		},
		{
			text: 'Which ocean surrounds the Maldives?',
			answers: [
				{ choice: 'Indonesian Ocean', correct: false },
				{ choice: 'Atlantic Ocean', correct: false },
				{ choice: 'Indian Ocean', correct: true },
				{ choice: 'Pacific Ocean', correct: false }
			]
		},
		{
			text: 'How many days does it take for the Earth to orbit the Sun? ',
			answers: [
				{ choice: '366', correct: false },
				{ choice: '365', correct: true },
				{ choice: '364', correct: false },
				{ choice: '363', correct: false }
			]
		},
		{
			text: 'What’s the smallest country in the world? ',
			answers: [
				{ choice: 'Kiribati', correct: false },
				{ choice: 'Nauru', correct: false },
				{ choice: 'Tuvalu', correct: false },
				{ choice: 'Vatican', correct: true }
			]
		},
		{
			text: 'What city do The Beatles come from? ',
			answers: [
				{ choice: 'Liverpool', correct: true },
				{ choice: 'Los Angeles', correct: false },
				{ choice: 'Tbilisi', correct: false },
				{ choice: 'New York', correct: false }
			]
		},
		{
			text: 'Which animal can be seen on the Porsche logo? ',
			answers: [
				{ choice: 'Deer', correct: false },
				{ choice: 'Pantera', correct: false },
				{ choice: 'Horse', correct: true },
				{ choice: 'Lion', correct: false }
			]
		},
		{
			text: 'What is the rarest M&M color? ',
			answers: [
				{ choice: 'Red', correct: false },
				{ choice: 'Blue', correct: false },
				{ choice: 'Green', correct: false },
				{ choice: 'Brown', correct: true }
			]
		},
		{
			text: 'How many colors are there in the rainbow? ',
			answers: [
				{ choice: '8', correct: false },
				{ choice: '5', correct: false },
				{ choice: '7', correct: true },
				{ choice: '6', correct: false }
			]
		},
		{
			text: 'What is the loudest animal on Earth? ',
			answers: [
				{ choice: 'Elephant', correct: false },
				{ choice: 'Lion', correct: false },
				{ choice: 'Sperm Whale', correct: true },
				{ choice: 'Shark', correct: false }
			]
		},
		{
			text: 'How long do elephant pregnancies last? ',
			answers: [
				{ choice: '20', correct: false },
				{ choice: '22', correct: true },
				{ choice: '9', correct: false },
				{ choice: '18', correct: false }
			]
		}
	],
	score: 0,
  	currentQuestionIndex: 0,
  	questionCounter: 0,
  	route: 'start'
};


setRoute = (state, route) => {
	state.route = route;
};

resetGame = state => {
	state.score = 0;
	state.currentQuestionIndex = 0;
	state.questionCounter = 0;
	setRoute(state, 'start');
};

resetAnswers = () => {
	$("#next-que").addClass("hide");
	$("#answer-btns").empty();
};

resetList = () => {
	$("#js-guide-list").empty();
};

getNewQuestion = () => {
	state.questionCounter++;
	let currentQuestion = state.questions[state.currentQuestionIndex];
	//Display Question & Question No
	$("#question-container").text(currentQuestion.text);
	$(".js-index").text(state.questionCounter);

	//Display choices and to the correct answer set data attr correct
	currentQuestion.answers.forEach(answer => {
		let $button = $("<button class='answer-btn'></button>");
		$button.text(answer.choice);
		if(answer.correct){
			$button.attr("correct", answer.correct);
		}
		$button.on("click", selectAnswer);
		$("#answer-btns").append($button);
	});
};

selectAnswer = event => {
	//Stop timer and disable buttons
	clearInterval(interval);
	$(".answer-btn").attr("disabled", "disabled");

	//show correct answer
	const clickedBtn = $(event.target);
	($("#answer-btns").children()).toArray().forEach(btn => {
		setStatusClass(btn, clickedBtn);
	});
	updateScore(clickedBtn);
	advance(state);
};

setStatusClass = (element, clickedBtn) => {
	clearStatusClass(element);
	if($(element).attr('correct')){
		$(element).addClass("correct");
	}else if($(clickedBtn).attr('correct')){
		$(clickedBtn).addClass("correct");
	}else{
		$(clickedBtn).addClass("wrong");
	}
};

clearStatusClass = element => {
	$(element).removeClass("correct");
	$(element).removeClass("wrong");
};

updateScore = answer => {
	if($(answer).attr("correct")){
		state.score++;
	}
};

advance = state => {
	state.currentQuestionIndex++;
	if (state.currentQuestionIndex > state.questions.length - 1) {
		$("#next-que").addClass("hide");
		$("#results-btn").removeClass("hide");
	 	setRoute(state, 'result');
	}
	else {
		$("#next-que").removeClass("hide");
	  	setRoute(state, 'quiz');
	}

};

countDown = () => {
	if(timer < 0){
		clearInterval(interval);
		$(".answer-btn").attr("disabled", "disabled");
		$("#next-que").removeClass("hide");
	}else{
		$(".time").text(timer--);
	}
};

// Render Functions
renderApp = (state, elements) => {
	Object.keys(elements).forEach(function (route){
		elements[route].hide();
	});
	elements[state.route].show();

	if (state.route === "start") {
      	renderStartPage(state, elements[state.route]);
  	}
  	else if(state.route === "guide") {
  	  	renderGuidePage();
  	}
	else if(state.route === "quiz"){
	  	renderQuestion();
	}
	else if(state.route === "result"){
	  	renderResults(state);
	}
};

renderStartPage = (state, element) => {
};

renderGuidePage = () => {
	resetList();
	guideList.forEach(function(list){
		let $list = $("<li class='list-item'></li>");
		$list.text(list);
		$("#js-guide-list").append($list);
	});
};

renderQuestion = () => {
	clearInterval(interval);
	resetAnswers();
	getNewQuestion();
	timer = 20;
  	interval = setInterval(countDown, 1000);
};

renderResults = (state) => {
	$(".score").text(state.score);
	$(".total").text(state.questions.length);
	if(state.score >= 6){
		$(".congrats-text").text("Good Job!");
	}
	else{
		$(".congrats-text").text("Not Bad!");
	}
};

//Event Handlers
const PAGE_ELEMENTS = {
	"start": $("#start"),
	"guide": $("#guide"),
	"quiz": $("#quiz"),
	"result": $("#result")
};

$("#start").click(function(event) {
  setRoute(state, "guide");
  renderApp(state, PAGE_ELEMENTS);
});

$("#next").click(function(event) {
  $("#results-btn").addClass("hide");
  setRoute(state, "quiz");
  renderApp(state, PAGE_ELEMENTS);
});

$("#exit").click(function(event) {
  setRoute(state, "start");
  renderApp(state, PAGE_ELEMENTS);
});

$("#next-que").click(function(event) {
  event.preventDefault();
  setRoute(state, "quiz");
  renderApp(state, PAGE_ELEMENTS);
});

$("#results-btn").click(function(event) {
	event.preventDefault();
	setRoute(state, "result");
	renderApp(state, PAGE_ELEMENTS);
});

$("#restart").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(function() { renderApp(state, PAGE_ELEMENTS); });