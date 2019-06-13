/* eslint-disable no-unused-vars */
$("#leaderBoard").hide();
$("#timeRemaining").hide();

function shakeThis(item) {
  anime({
    targets: item,
    keyframes: [{ translateY: -10 }, { translateY: 10 }, { translateY: 0 }],
    duration: 500,
    easing: "easeInOutQuad",
    loop: false
  });
}

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

$("button").on("click", function() {
  var sButton = $(this).attr("data-btn");
  if (sButton === "start") {
    startRound(currentRound);
    $("#player-wait-modal").modal("toggle");
  } else if (sButton === null) {
    console.log("not a start button!");
  }
});
$("#qAndA").on("click", ".ansa", function() {
  shakeThis(this);
  console.log("correct!");
  console.log("THERE IS THIS!!!");
  console.log($(this).attr("class"));
  score += 100 * currentRound;
  var postReq = "/api/user/gameid/" + myUserID + "/" + score + "/";
  $.post(postReq, function(data) {
    console.log(postReq);
    console.log(data);
    var postReq2 = "/api/game/score/" + myGameID;
    var newDiv = $("<div>");

    $.post(postReq2, function(data) {
      //$("#leaderBoard").html(newTable);
      for (i = 0; i < data.length; i++) {
        console.log("HERE IS YOUR DATA IN LOOP!");
        console.log(data[i]);
        var newRow2 = $("<div>").attr("class", "row player");
        var uname = $("<span>").text(data[i].username);
        uname.attr("class", "col-md-6 player-name");
        var uscore = $("<span>").text(data[i].score);
        uscore.attr("class", "col-md-6 player-score");
        uname.appendTo(newRow2);
        uscore.appendTo(newRow2);
        newRow2.appendTo(newDiv);
      }
      $("#appendScoresHere").html(newDiv);
    });
  });
  console.log("current score:  " + score);
  $(this).removeAttr("data-answer");
  $(this).removeClass("answer");
  $(this).addClass("success");
  $(this).removeClass("ansa");

  timer1();
});

$("#qAndA").on("click", ".fa", function() {
  shakeThis(this);
  console.log("incorrect!");
  console.log("myuseridis:  " + myUserID);
  console.log("THERE IS THIS!!!");
  console.log($(this).attr("class"));
  score -= 100 * 0.25 * currentRound;
  console.log("current score:  " + score);
  var postReq = "/api/user/gameid/" + myUserID + "/" + score + "/";
  $.post(postReq, function(data) {
    console.log(postReq);
    console.log(data);
    var postReq2 = "/api/game/score/" + myGameID;
    var newDiv = $("<div>");

    $.post(postReq2, function(data) {
      //$("#leaderBoard").html(newTable);
      for (i = 0; i < data.length; i++) {
        console.log("HERE IS YOUR DATA IN LOOP!");
        console.log(data[i]);
        var newRow2 = $("<div>").attr("class", "row player");
        var uname = $("<span>").text(data[i].username);
        uname.attr("class", "col-md-6 player-name");
        var uscore = $("<span>").text(data[i].score);
        uscore.attr("class", "col-md-6 player-score");
        uname.appendTo(newRow2);
        uscore.appendTo(newRow2);
        newRow2.appendTo(newDiv);
      }
      $("#appendScoresHere").html(newDiv);
    });
  });
  $(this).removeAttr("data-answer");
  $(this).removeClass("answer");
  $(this).addClass("failure");
  $(this).removeClass("fa");

  timer1();
});

var easyQuestions;
var medQuestions;
var hardQuestions;

function startRound(currentRound) {
  $("#leaderBoard").show();
  getQuest(currentRound);
  timer60();
}

var currentRound = 1;

var easyQuestNum = 0,
  medQuestNum = 0,
  hardQuestNum = 0;

function getQuest(round) {
  var diff;
  if (round === 1) {
    diff = "easy";
  } else if (round === 2) {
    diff = "medium";
  } else if (round === 3) {
    diff = "hard";
  }

  var queryURL = "https://opentdb.com/api.php?amount=50&difficulty=" + diff;

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

  var quest = decodeHtml(data[counter].question);
  var q = $("<h3>").text(quest);
  q.addClass("question");
  $("#qDiv").empty();
  $("#qDiv").append(q);
  $("#ansDiv").empty();
  if (data[counter].type === "multiple") {
    var answers = [
      decodeHtml(data[counter].incorrect_answers[0]),
      decodeHtml(data[counter].incorrect_answers[1]),
      decodeHtml(data[counter].incorrect_answers[2]),
      decodeHtml(data[counter].correct_answer)
    ];
    var shuffled = [];
    for (var i = 0; i < 4; i++) {
      var index = Math.floor(Math.random() * answers.length);
      shuffled[i] = answers[index];
      answers.splice(index, 1);
    }
    for (var i = 0; i < 4; i++) {
      var ans = $("<p>").text(shuffled[i]);
      ans.addClass("answer");
      ans.addClass("answer-style");
      if (shuffled[i] === data[counter].correct_answer) {
        ans.attr("data-answer", "ans");
        ans.addClass("ansa");
      } else {
        ans.attr("data-answer", "f");
        ans.addClass("fa");
      }
      $("#ansDiv").append(ans);
    }
  } else if (data[counter].type === "boolean") {
    $("#ansDiv").empty();
    var t = $("<p>").text("True");
    var f = $("<p>").text("False");
    t.addClass("answer");
    t.addClass("answer-style");
    f.addClass("answer");
    f.addClass("answer-style");
    if (data[counter].correct_answer === "True") {
      t.attr("data-answer", "ans");
      t.addClass("ansa");
      f.attr("data-answer", "f");
      f.addClass("fa");
    } else {
      f.attr("data-answer", "ans");
      f.addClass("ansa");
      t.attr("data-answer", "f");
      t.addClass("fa");
    }
    $("#ansDiv").append(t);
    $("#ansDiv").append(f);
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
  //addClickEvent();
}

var intervalId1;
var intervalId60;
var intervalId10;
var number1 = 1;
var number60 = 60;
var number10 = 10;
var score = 0;

function timer1() {
  number1 = 1;
  function runTimer() {
    clearInterval(intervalId1);
    intervalId1 = setInterval(decrement, 1000);
  }
  function decrement() {
    number1--;
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
  $("#qAndA").show();
  $("#timeRemaining").show();
}

function newRound(round) {
  $("#timeRemaining").hide();
  $("#qAndA").hide();
  var title = $("<h1>").text("Round " + round + "!");
  title.addClass("newRound");
  $("#newRound").empty();
  $("#newRound").append(title);
  $("#newRound").show();
  roundAnimation();
}

function endGame() {
  $("#qAndA").hide();
  $("#newRound").text("Calculating Results...");
  setTimeout(function() {
    clearInterval(intervalId10);
    clearInterval(intervalId1);
    clearInterval(intervalId60);
    $("#exampleModalLabel").text("Final Results!");
    var postReq2 = "/api/game/score/" + myGameID;
    var newDiv = $("<div>");
    $.post(postReq2, function(data) {
      //$("#leaderBoard").html(newTable);
      for (i = 0; i < data.length; i++) {
        console.log("HERE IS YOUR DATA IN LOOP!");
        console.log(data[i]);
        var newRow2 = $("<div>").attr("class", "row player");
        var uname = $("<span>").text(data[i].username);
        uname.attr("class", "col-md-6 player-name");
        var uscore = $("<span>").text(data[i].score);
        uscore.attr("class", "col-md-6 player-score");
        uname.appendTo(newRow2);
        uscore.appendTo(newRow2);
        newRow2.appendTo(newDiv);
      }
      $("#modal-body").html(newDiv);
    });
    $("#player-wait-modal").modal("toggle");
  }, 8000);
}

function answeredAnimation() {
  anime({
    targets: ".animation-keyframes-demo .el",
    keyframes: [{ translateY: -10 }, { translateY: 10 }, { translateY: 0 }],
    duration: 500,
    easing: "easeOutElastic(1, .8)",
    loop: true
  });
}

function openAnimation() {
  anime
    .timeline({ loop: false })
    .add({
      targets: ".string .word",
      scale: [14, 1],
      opacity: [0, 1],
      easing: "easeOutCirc",
      duration: 800,
      delay: function(el, i) {
        return 800 * i;
      }
    })
    .add({
      targets: ".string",
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });
}

var intervalId5;
var number5 = 5;

function timer5() {
  number5 = 5;
  function runTimer() {
    $("#gameBoard").hide();
    openAnimation();
    clearInterval(intervalId5);
    intervalId5 = setInterval(decrement, 1000);
  }
  function decrement() {
    number5--;
    if (number5 === 0) {
      stopTimer();
    } else if (number5 === 1) {
      $("#openAnime").fadeOut();
    }
  }
  function stopTimer() {
    clearInterval(intervalId5);
    $("#gameBoard").fadeIn();
  }
  runTimer();
}
timer5();

function roundAnimation() {
  anime({
    targets: ".newRound",
    rotate: {
      value: 360,
      duration: 1800,
      easing: "easeInOutSine"
    }
  });
}
