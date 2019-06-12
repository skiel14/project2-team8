/* eslint-disable no-unused-vars */
$("button").on("click", function() {
  var sButton = $(this).attr("data-btn");
  if (sButton === "start") {
    startRound(currentRound);
    $("#player-wait-modal").modal("toggle");
  } else if (sButton === null) {
    console.log("not a start button!");
  }
});

var questions;

function startRound(currentRound) {
  getQuest(currentRound);
  timer60();
}

var currentRound = 1;

var easyQuestNum = 0,
  medQuestNum = 0,
  hardQuestNum = 0;

function getQuest() {
  // var diff;
  // if (round === 1) {
  //   diff = "easy";
  // } else if (round === 2) {
  //   diff = "medium";
  // } else if (round === 3) {
  //   diff = "hard";
  // }

  var queryURL =
    "https://storage.googleapis.com/kaggle-datasets/25397/32360/DB.json?GoogleAccessId=web-data@kaggle-161607.iam.gserviceaccount.com&Expires=1560556095&Signature=UnBT838gqeYo4q6knGuz6dh8GkgBmgIkGBWfDZD1yzfmevexpaSgLwszY4JIyJB5VIRtFSJnxXI%2FhoUmyxG9K6y%2BPnQ9WySrVxtlPRqWQug3kHvSip6VDJ5bam3XOssTbmtCZ6%2BO15yQC6Hjx7JLRm5ZhGnkPV9EMb%2FUhPNpqcgZwKb3ZO0mxQiruDCzoZe85AubXFLV1rbYC9iUyE%2F0EMYRivy9XRFV378ZwvRhqLoFbG2a0av%2FxJI8gwT8pnJDbuEx45a3z0XJiRPM%2By95kp7Vs17U0xy75FXqE8dcQxMdxT9nxYEC0ONF0PdfZn%2FLMZdLLVhyg7db73fqmwRvBA%3D%3D";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    if (currentRound === 1) {
      easyQuestions = response.results;
      loadQuest(currentRound);
    } else if (currentRound === 2) {
      medQuestions = response.results;
      loadQuest(currentRound);
    } else if (currentRound === 3) {
      hardQuestions = response.results;
      loadQuest(currentRound);
    }
  });
}

function loadQuest(round) {
  var data, counter;
  if (round === 1) {
    //diff="easy";
    data = easyQuestions;
    counter = easyQuestNum;
  } else if (round === 2) {
    //diff="medium";
    data = medQuestions;
    counter = medQuestNum;
  } else if (round === 3) {
    //diff="hard";
    data = hardQuestions;
    counter = hardQuestNum;
  }

  var quest = data[counter].question;
  var q = $("<h3>").text(quest);
  q.addClass("question");
  $("#qDiv").empty();
  $("#qDiv").append(q);
  $("#ansDiv").empty();
  if (data[counter].type === "multiple") {
    var answers = [
      data[counter].incorrect_answers[0],
      data[counter].incorrect_answers[1],
      data[counter].incorrect_answers[2],
      data[counter].correct_answer
    ];
    var shuffled = [];
    for (var i = 0; i < 4; i++) {
      var index = Math.floor(Math.random() * answers.length);
      shuffled[i] = answers[index];
      answers.splice(index, 1);
    }
    for (var i = 0; i < 4; i++) {
      var outer = $("<div>").addClass("row");
      var inner = $("<div>").addClass("col-md-12");
      var ans = $("<p>").text(shuffled[i]);
      ans.addClass("answer");
      if (shuffled[i] === data[counter].correct_answer) {
        ans.attr("data-answer", "ans");
      } else {
        ans.attr("data-answer", "");
      }
      inner.append(ans);
      outer.append(inner);
      $("#ansDiv").append(outer);
    }
  } else if (data[counter].type === "boolean") {
    $("#ansDiv").empty();
    var outer = $("<div>").addClass("row");
    var inner = $("<div>").addClass("col-md-12");
    var t = $("<p>").text("True");
    var f = $("<p>").text("False");
    t.addClass("answer");
    f.addClass("answer");
    if (data[counter].correct_answer === "True") {
      t.attr("data-answer", "ans");
      f.attr("data-answer", "");
    } else {
      f.attr("data-answer", "ans");
      t.attr("data-answer", "");
    }
    inner.append(t);
    inner.append(f);
    outer.append(inner);
    $("#ansDiv").append(outer);
  }

  if (round === 1) {
    //diff="easy";
    easyQuestNum++;
  } else if (round === 2) {
    //diff="medium";
    medQuestNum++;
  } else if (round === 3) {
    //diff="hard";
    hardQuestNum++;
  }
  addClickEvent();
}

var score = 0;
function addClickEvent() {
  $(".answer").click(function() {
    if ($(this).attr("data-answer") === "ans") {
      console.log("correct!");
      score += 100 * currentRound;
      var postReq = "/api/user/gameid/" + myUserID + "/" + score + "/";
      $.post(postReq, function(data) {
        console.log(postReq);
        console.log(data);
      });
      console.log("current score:  " + score);
      $(this).removeClass("answer");
      $(this).addClass("success");
    } else {
      console.log("incorrect!");
      console.log("myuseridis:  " + myUserID);
      score -= 100 * currentRound;
      console.log("current score:  " + score);
      var postReq = "/api/user/gameid/" + myUserID + "/" + score + "/";
      $.post(postReq, function(data) {
        console.log(postReq);
        console.log(data);
      });
      $(this).removeClass("answer");
      $(this).addClass("failure");
    }
    var postReq2 = "/api/game/score/" + myGameID;
    $.post(postReq2, function(data) {
      var newTable = $("<table>");
      var newRow = $("<tr>");
      var userHead = $("<th>").text("Username");
      var scoreHead = $("<th>").text("Score");

      userHead.appendTo(newRow);
      scoreHead.appendTo(newRow);
      newRow.appendTo(newTable);
      $("#leaderBoard").html(newTable);
      console.log("HERE IS YOUR DATA IN LOOP!");
      console.log(data[i]);
      for (i = 0; i < data.length; i++) {
        console.log("HERE IS YOUR DATA IN LOOP!");
        console.log(data[i]);
        var newRow2 = $("<tr>");
        var uname = $("<td>").text(data[i].username);
        var uscore = $("<td>").text(data[i].score);
        uname.appendTo(newRow2);
        uscore.appendTo(newRow2);
        newRow2.appendTo(newTable);
      }
      $("#leaderBoard").html(newTable);
    });
    timer1();
  });
}

var intervalId1;
var intervalId60;
var intervalId10;
var number1 = 1;
var number60 = 60;
var number10 = 10;

function timer1() {
  number1 = 1;
  function runTimer() {
    clearInterval(intervalId1);
    intervalId1 = setInterval(decrement, 1000);
  }
  function decrement() {
    number1--;
    console.log("Timer Number(1):  " + number1);
    if (number1 === 0) {
      stopTimer();
      loadQuest(currentRound);
    }
  }
  function stopTimer() {
    clearInterval(intervalId1);
  }
  runTimer();
}

function timer10() {
  number10 = 10;
  function runTimer() {
    clearInterval(intervalId10);
    intervalId10 = setInterval(decrement, 1000);
  }
  function decrement() {
    number10--;
    console.log("Timer Number(10):  " + number10);
    if (number10 === 0) {
      stopTimer();
      startRound(currentRound);
    }
  }
  function stopTimer() {
    clearInterval(intervalId10);
  }
  runTimer();
  newRound(currentRound);
}

function timer60() {
  number60 = 60;
  function runTimer() {
    clearInterval(intervalId60);
    intervalId60 = setInterval(decrement, 1000);
  }
  function decrement() {
    number60--;
    $("#secondsRemaining").html(number60);
    console.log("Timer Number(60):  " + number60);
    if (number60 === 0) {
      stopTimer();
      currentRound++;
      timer10();
      if (currentRound === 4) {
        endGame();
      }
    }
  }
  function stopTimer() {
    clearInterval(intervalId60);
  }
  runTimer();
  $("#newRound").hide();
  $("#qDiv").show();
  $("#ansDiv").show();
}

function newRound(round) {
  $("#qDiv").hide();
  $("#ansDiv").hide();
  var title = $("<h3>").text("Round " + round + "!");
  $("#newRound").empty();
  $("#newRound").append(title);
  $("#newRound").show();
}

function endGame() {
  $("#qDiv").hide();
  $("#ansDiv").hide();
  $("#newRound").hide();
  alert("End Game!");
  //Go to scores page
}

// var questions = [
//   {
//     questionType: "multiChoice",
//     question:
//       "What African country served as the setting for Tatooine in <em>Star Wars?</em>",
//     answer: ["Morocco", "Egypt", "Tunisia", "Ethiopia"],
//     name: "tatooineCountry",
//     correct: "Tunisia",
//     divClass: ".tatooineCountry"
//   },
//   {
//     questionType: "trueFalse",
//     question:
//       "If Harrison Ford had not been cast as Han Solo, George Lucas's next choice was Christopher Walken.",
//     answer: ["True", "False"],
//     name: "hanSolo",
//     correct: "True",
//     divClass: ".hanSolo"
//   },
//   {
//     questionType: "multiChoice",
//     question:
//       "What British actor portrayed the suave, sinister villain Hans Gruber<br>in the first <em>Die Hard</em> movie?",
//     answer: ["Hugh Jackman", "Alan Rickman", "Pierce Brosnan", "Gary Oldman"],
//     name: "hansGruber",
//     correct: "Alan Rickman",
//     divClass: ".hansGruber"
//   },
//   {
//     questionType: "multiChoice",
//     question:
//       "What actor was the first choice to play 'Dirty Harry' Callahan,<br>the role eventually made iconic by Clint Eastwood?",
//     answer: ["Steve McQueen", "Robert Shaw", "Marlon Brando", "Frank Sinatra"],
//     name: "dirtyHarry",
//     correct: "Frank Sinatra",
//     divClass: ".dirtyHarry"
//   },
//   {
//     questionType: "multiChoice",
//     question:
//       "Which film tells the true story of the schizophrenic mathematician John Nash?",
//     answer: [
//       "On the Edge",
//       "Confessions of a Dangerous Mind",
//       "A Beautiful Mind",
//       "The Butterfly Effect"
//     ],
//     name: "johnNash",
//     correct: "A Beautiful Mind",
//     divClass: ".johnNash"
//   },
//   {
//     questionType: "multiChoice",
//     question: "What is the largest country in the world?",
//     answer: ["United States", "China", "Canada", "Russia"],
//     name: "largestCountry",
//     correct: "China",
//     divClass: ".largestCountry"
//   },
//   {
//     questionType: "multiChoice",
//     question: "In what country can you visit Machu Picchu?",
//     answer: ["Chile", "Bolivia", "Peru", "Colombia"],
//     name: "machuPicchu",
//     correct: "Peru",
//     divClass: ".machuPicchu"
//   },
//   {
//     questionType: "multiChoice",
//     question: "What is the largest continent on earth?",
//     answer: ["Europe", "Antarctica", "Africa", "Asia"],
//     name: "largestContinent",
//     correct: "Asia",
//     divClass: ".largestContinent"
//   },
//   {
//     questionType: "multiChoice",
//     question: "How many members are there in the US Congress?",
//     answer: ["100", "538", "438", "535"],
//     name: "membersOfCongress",
//     correct: "538",
//     divClass: ".membersOfCongress"
//   },
//   {
//     questionType: "multiChoice",
//     question:
//       "What is the subject of the 19th Amendment of the US Constitution?",
//     answer: [
//       "The abolition of slavery",
//       "Women's suffrage",
//       "Presidential Succession",
//       "Prohibition"
//     ],
//     name: "constitutionalAmendment19",
//     correct: "Women's suffrage",
//     divClass: ".constitutionalAmendment19"
//   },
//   {
//     questionType: "multiChoice",
//     name: "abeLincoln",
//     divClass: ".abeLincoln",
//     question: "Who was the 16th President of the United States?",
//     answer: [
//       "John Quincy Adams",
//       "Thomas Jefferson",
//       "Abraham Lincoln",
//       "Theodore Roosevelt"
//     ],
//     correct: "Abraham Lincoln"
//   }
// ];

// var thisQuestion = questions[1],
//   questionNumber = 1,
//   // playerName,
//   seconds = 300000,
//   correctAnswers,
//   incorrectAnswers,
//   labels = ["first", "second", "third", "forth"];

// //  Click to start, then display questions
// $("#startButton").on("click", function() {
//   // playerName = $("#playerNameText").val();
//   displayQuestion();

//   $("#doneButton").css("display", "block");
//   countdown();
// });

// // Display the questions
// var displayQuestion = function() {
//   $("#questions")
//     .children()
//     .not("#doneButton")
//     .remove();

//   // Display a question -- eventually from Sarah's API call
//   $("#questionText").text(questionNumber + ".  " + thisQuestion.question);

//   // Build lists of 4 radio buttons & answers for each question
//   if (thisQuestion.questionType === "trueFalse") {
//     //for (var j = 0; j < 2; j++) {
//     //$(thisQuestion.divClass).append('<div class="answer"><input type="radio"  name="' + thisQuestion.name + '" value="' + thisQuestion.answer[j] + '"><label for="' + labels[j] + '">' + thisQuestion.answer[j] + '</label></div>'); }
//     $("#answer0").append(thisQuestion.answer[0]);
//     $("#answer1").append(thisQuestion.answer[1]);
//   } else {
//     {
//       for (var j = 0; j <= 3; j++) {
//         /* eslint-disable */
//         $(thisQuestion.divClass).append(
//           '<div class="answer"><input type="radio"  name="' +
//             thisQuestion.name +
//             '" value="' +
//             thisQuestion.answer[j] +
//             '"><label for="' +
//             labels[j] +
//             '">' +
//             thisQuestion.answer[j] +
//             "</label></div>"
//         );
//         /* eslint-enable */
//       }
//     }
//     $("#questionsAndAnswers").prepend("<hr>");
//   }
// };

// var countdown = function() {
//   var timer = setInterval(function() {
//     seconds -= 1;
//     $("#secondsRemaining").html(seconds);

//     if (seconds === 5) {
//       $("#secondsRemaining").css("color", "red");
//     }

//     if (seconds <= 0) {
//       checkAnswers();
//       displayAnswers();
//       clearInterval(timer);
//       return;
//     }
//   }, 1000);
// }; //  countdown

// // Terminate timer loop when "Done" button is clicked
// $("#doneButton").on("click", function() {
//   seconds = 0;
// });

// function checkAnswers() {
//   correctAnswers = 0;
//   incorrectAnswers = 0;

//   // loop through questions array & match radio buttons with values of "checked" to correct answers
//   for (var i = 0; i < 10; i++) {
//     if (
//       /* eslint-disable */
//       $('input:radio[name="' + thisQuestion.name + '"]:checked').val() ===
//       thisQuestion.correct
//     ) {
//       correctAnswers++;
//     } else {
//       incorrectAnswers++;
//     }
//     /* eslint-enable */
//   }
// }

// function displayAnswers() {
//   $("#correctAnswers").append(correctAnswers);
//   $("#incorrectAnswers").append(incorrectAnswers);

//   $("#game-board").hide();
//   $("#results").show();
// }

// $("#playAgainButton").on("click", function() {
//   seconds = 30;
//   correctAnswers = 0;
//   incorrectAnswers = 0;

//   $("#secondsRemaining").text("30");

//   $("#correctAnswers").text("Correct Answers: ");
//   $("#incorrectAnswers").text("Incorrect Answers: ");

//   $("#results").hide();
//   $("#game-board").show();
//   $("#questions")
//     .children()
//     .not("#doneButton")
//     .remove();
//   $("#doneButton").css("display", "none");
//   $("#playerNameText").val("");
// });
