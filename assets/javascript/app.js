var questions = [
  {
    questionType: "multiChoice",
    question:
      "What African country served as the setting for Tatooine in <em>Star Wars?</em>",
    answer: ["Morocco", "Egypt", "Tunisia", "Ethiopia"],
    name: "tatooineCountry",
    correct: "Tunisia",
    divClass: ".tatooineCountry"
  },
  {
    questionType: "trueFalse",
    question:
      "If Harrison Ford had not been cast as Han Solo, George Lucas's next choice was Christopher Walken.",
    answer: ["True", "False"],
    name: "hanSolo",
    correct: "True",
    divClass: ".hanSolo"
  },
  {
    questionType: "multiChoice",
    question:
      "What British actor portrayed the suave, sinister villain Hans Gruber<br>in the first <em>Die Hard</em> movie?",
    answer: ["Hugh Jackman", "Alan Rickman", "Pierce Brosnan", "Gary Oldman"],
    name: "hansGruber",
    correct: "Alan Rickman",
    divClass: ".hansGruber"
  },
  {
    questionType: "multiChoice",
    question:
      "What actor was the first choice to play 'Dirty Harry' Callahan,<br>the role eventually made iconic by Clint Eastwood?",
    answer: ["Steve McQueen", "Robert Shaw", "Marlon Brando", "Frank Sinatra"],
    name: "dirtyHarry",
    correct: "Frank Sinatra",
    divClass: ".dirtyHarry"
  },
  {
    questionType: "multiChoice",
    question:
      "Which film tells the true story of the schizophrenic mathematician John Nash?",
    answer: [
      "On the Edge",
      "Confessions of a Dangerous Mind",
      "A Beautiful Mind",
      "The Butterfly Effect"
    ],
    name: "johnNash",
    correct: "A Beautiful Mind",
    divClass: ".johnNash"
  },
  {
    questionType: "multiChoice",
    question: "What is the largest country in the world?",
    answer: ["United States", "China", "Canada", "Russia"],
    name: "largestCountry",
    correct: "China",
    divClass: ".largestCountry"
  },
  {
    questionType: "multiChoice",
    question: "In what country can you visit Machu Picchu?",
    answer: ["Chile", "Bolivia", "Peru", "Colombia"],
    name: "machuPicchu",
    correct: "Peru",
    divClass: ".machuPicchu"
  },
  {
    questionType: "multiChoice",
    question: "What is the largest continent on earth?",
    answer: ["Europe", "Antarctica", "Africa", "Asia"],
    name: "largestContinent",
    correct: "Asia",
    divClass: ".largestContinent"
  },
  {
    questionType: "multiChoice",
    question: "How many members are there in the US Congress?",
    answer: ["100", "538", "438", "535"],
    name: "membersOfCongress",
    correct: "538",
    divClass: ".membersOfCongress"
  },
  {
    questionType: "multiChoice",
    question:
      "What is the subject of the 19th Amendment of the US Constitution?",
    answer: [
      "The abolition of slavery",
      "Women's suffrage",
      "Presidential Succession",
      "Prohibition"
    ],
    name: "constitutionalAmendment19",
    correct: "Women's suffrage",
    divClass: ".constitutionalAmendment19"
  },
  {
    questionType: "multiChoice",
    name: "abeLincoln",
    divClass: ".abeLincoln",
    question: "Who was the 16th President of the United States?",
    answer: [
      "John Quincy Adams",
      "Thomas Jefferson",
      "Abraham Lincoln",
      "Theodore Roosevelt"
    ],
    correct: "Abraham Lincoln"
  }
];

var thisQuestion = questions[1],
  questionNumber = 1,
  // playerName,
  seconds = 300000,
  correctAnswers,
  incorrectAnswers,
  labels = ["first", "second", "third", "forth"];

//  Click to start, then display questions
$("#startButton").on("click", function() {
  // playerName = $("#playerNameText").val();
  displayQuestion();

  $("#doneButton").css("display", "block");
  countdown();
});

// Display the questions
var displayQuestion = function() {
  $("#questions")
    .children()
    .not("#doneButton")
    .remove();

  // Display a question -- eventually from Sarah's API call
  $("#questionText").text(questionNumber + ".  " + thisQuestion.question);

  // Build lists of 4 radio buttons & answers for each question
  if (thisQuestion.questionType === "trueFalse") {
    //for (var j = 0; j < 2; j++) {
    //$(thisQuestion.divClass).append('<div class="answer"><input type="radio"  name="' + thisQuestion.name + '" value="' + thisQuestion.answer[j] + '"><label for="' + labels[j] + '">' + thisQuestion.answer[j] + '</label></div>'); }
    $("#answer0").append(thisQuestion.answer[0]);
    $("#answer1").append(thisQuestion.answer[1]);
  } else {
    {
      for (var j = 0; j <= 3; j++) {
        /* eslint-disable */
        $(thisQuestion.divClass).append(
          '<div class="answer"><input type="radio"  name="' +
            thisQuestion.name +
            '" value="' +
            thisQuestion.answer[j] +
            '"><label for="' +
            labels[j] +
            '">' +
            thisQuestion.answer[j] +
            "</label></div>"
        );
        /* eslint-enable */
      }
    }
    $("#questionsAndAnswers").prepend("<hr>");
  }
};

var countdown = function() {
  var timer = setInterval(function() {
    seconds -= 1;
    $("#secondsRemaining").html(seconds);

    if (seconds === 5) {
      $("#secondsRemaining").css("color", "red");
    }

    if (seconds <= 0) {
      checkAnswers();
      displayAnswers();
      clearInterval(timer);
      return;
    }
  }, 1000);
}; //  countdown

// Terminate timer loop when "Done" button is clicked
$("#doneButton").on("click", function() {
  seconds = 0;
});

function checkAnswers() {
  correctAnswers = 0;
  incorrectAnswers = 0;

  // loop through questions array & match radio buttons with values of "checked" to correct answers
  for (var i = 0; i < 10; i++) {
    if (
      /* eslint-disable */
      $('input:radio[name="' + thisQuestion.name + '"]:checked').val() ===
      thisQuestion.correct
    ) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
    /* eslint-enable */
  }
}

function displayAnswers() {
  $("#correctAnswers").append(correctAnswers);
  $("#incorrectAnswers").append(incorrectAnswers);

  $("#game-board").hide();
  $("#results").show();
}

$("#playAgainButton").on("click", function() {
  seconds = 30;
  correctAnswers = 0;
  incorrectAnswers = 0;

  $("#secondsRemaining").text("30");

  $("#correctAnswers").text("Correct Answers: ");
  $("#incorrectAnswers").text("Incorrect Answers: ");

  $("#results").hide();
  $("#game-board").show();
  $("#questions")
    .children()
    .not("#doneButton")
    .remove();
  $("#doneButton").css("display", "none");
  $("#playerNameText").val("");
});
