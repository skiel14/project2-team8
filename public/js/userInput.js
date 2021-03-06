var myUserID;
var intervalclr;

$("#startButton").click(function(event) {
  event.preventDefault();
  var postReq =
    "/api/user/create/" +
    $("#playerNameText")
      .val()
      .trim();
  console.log(postReq);
  $("#player-wait-modal").modal({ backdrop: "static", keyboard: false });
  $.post(postReq, function(data) {
    myGameID = data.gameId;
    myUserID = data.id;
    intervalclr = setInterval(usersInQueue, 3000);
  });
});

function usersInQueue() {
  postReq = "/api/user/queue";
  var newDiv = $("<div>");
  $.post(postReq, function(data) {
    console.log(data);
    if (
      data.filter(function(e) {
        return e.id === myUserID;
      }).length > 0
    ) {
      console.log("loop continues");
      for (i = 0; i < data.length; i++) {
        var userList = $("<h6>");
        var newHead = userList.text(data[i].username);
        newHead.appendTo(newDiv);
      }
      $("#usersGoHere").html(newDiv);
    } else {
      $("#goButton").show();
      clearInterval(intervalclr);
    }
  });
}

function startGame() {
  postReq = "/api/game/start";
  $.post(postReq, function(data) {
    console.log(data);
  });
}

if (myUserID === "askdlfasjdfsaldkfjds") {
  startGame();
}
