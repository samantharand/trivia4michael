var questions;
var skippedQuestions = [];
var selectedQuestion;
var timer = -1;
var timerInterval;
var score = 0;

const start = function() {
	getData()

	setTimeout(function() {
		getQuestions()
	}, 1000)
	
	$('#gameBox').show()
	$('#startMenu').hide()
	startTimer()
	$('#nesBaloonText').html(`Score: <span id='scoreSpan'>0</span> Time: <span id='timeSpan'>0</span>s Answered: <span id='countSpan'>1</span> / <span id='totalSpan'>10</span>`)
	
}

const showGameContent = function () {
	$('#loadingMessage').hide()
	$('#actionButtons').show()
	$('.message-list').css("justify-content", "space-between")
	
}

const startTimer = function() {
	timerInterval = setInterval(function() {
		timer += 1
		$('#timeSpan')[0].innerText = timer
	}, 1000)
}

const end = function() {
	// show end screen with game summary
	// maybe have a continue option??? idk :/
	// stop timer
	clearInterval(timerInterval)
}

const shuffle = function(arrayForShuffle) {
  var copy = []
  var n = arrayForShuffle.length
  var i

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * arrayForShuffle.length);

    // If not already shuffled, move it to the new array.
    if (i in arrayForShuffle) {
      copy.push(arrayForShuffle[i]);
      delete arrayForShuffle[i];
      n--;
    }
  }
  return copy
}


const getData = function () {
	$.ajax({
		url: 'https://opentdb.com/api.php?amount=10&type=multiple'
	}).done(function(response){
		questions = response.results
	})
}

const getQuestions = function() {
	$('#questionBox').html('')

	// if there are no questions left, move on to skipped questions
	if(questions.length == 0) {
		console.log('move on to skipped questions here')
		// just set questions = skippedQuestions

		// if no skipped AND no questions, end game
	}

	// randomize index based on array length to select a question
	var index = parseInt(Math.random() * questions.length)

	// randomize order of possible answers
	selectedQuestion = questions[index]

	var answerOptions = []

	selectedQuestion.incorrect_answers.forEach(function(iA) {
		answerOptions.push({answer: iA, correct: false})
	})

	answerOptions.push({answer: selectedQuestion.correct_answer, correct: true})

	answerOptions = shuffle(answerOptions)

	$('#questionBox').append(`
		<div class="row">
		    <div class="col-12" id="promptBox">
		      ${selectedQuestion.question}
		    </div>
	 	</div>
	`)

	answerOptions.forEach(function(aO) {
		$('#questionBox').append(`
			<div class="row">
			    <div class="col-12 answerOption ${ aO.correct ? 'correct' : 'incorrect' }">
			      <button class='btn btn-sm btn-light answerOptionBtn ${ aO.correct ? 'correct' : 'incorrect' }'>${aO.answer}</button>
			    </div>
		 	</div>
		`)
	})


	showGameContent()
	// $('#loadingMessage').hide()
	// $('#actionButtons').show()
	// $('.message-list').css("justify-content", "space-between")

	filterAnsweredQuestion(selectedQuestion)	
}

const filterAnsweredQuestion = function(selectedQuestion) {
	questions = questions.filter( question => (question.correct_answer != selectedQuestion.correct_answer) && (question.question != selectedQuestion.question) )
}

const userSelectedCorrect = function() {
	console.log('right')

	// increase score
	$('#scoreSpan')[0].innerText = score += 1
	// ding
}

const userSelectedIncorrect = function() {
	console.log('wrong lol')
	
	// decrease score
	// buzzer
}

const highlightAnswers = function(clickedAnswer) {
	console.log('highlight')

	console.log(clickedAnswer[0].classList[4])

	if(clickedAnswer.hasClass('incorrect')) {
		clickedAnswer.css('border', 'solid #e76e55 2px')
	} else {
		clickedAnswer.css('border', 'solid #92cc41 2px')
	}

	// $('.answerOptionBtn').removeClass('btn-light')
	// $('button.correct').addClass('btn-success')
	// $('button.incorrect').addClass('btn-danger')
	$('.answerOption.correct').append(`<span class="is-warning"><i class="nes-icon star is-small"></i></span>`)
	// clickedAnswer.parent().append(`<span class="is-warning"><i class="nes-icon close is-medium"></i></span>`)
}






// LISTENERS

$('body').on('click', '.answerOption button', function() {
	// highlight answers 
	highlightAnswers( $(this) )

	if( $(this).hasClass( "correct" ) ) {
		userSelectedCorrect()
	} else {
		userSelectedIncorrect()
	}
	// "Next Question" Button
	$('#nextBtn').attr('disabled', false)
	$('#skipBtn').attr('disabled', true)
})

$('#startBtn').on('click', function() {
	start()
})

$('#nextBtn').on('click', function() {
	getQuestions()
	$('#nextBtn').attr('disabled', true)
	$('#skipBtn').attr('disabled', false)

	// increase progress
	var progress = parseInt( $('#countSpan')[0].innerText )

	$('#countSpan')[0].innerText = progress += 1
})

$('#skipBtn').on('click', function() {
	skippedQuestions.push(selectedQuestion)
	getQuestions()

	// dont touch progress here bc skipped questions are still in the count
})

$('#resetBtn').on('click', function() {
	console.log('reset :)')
	// reset header info (clock, score, progress, etc.)
	// reset to main menu
})






// mouse icon

// $(document).ready(function(){
//   $('html').mousemove(function(e){
//         var x = e.pageX - this.offsetLeft;
//         var y = e.pageY - this.offsetTop;
//         $('div.movablediv').css({'top': y,'left': x}); 
//   });
// });















