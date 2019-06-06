$("#joinGame").click(function(event) {
  event.preventDefault();
  var postReq =
    "/api/user/create/" +
    $("#username-box")
      .val()
      .trim();
  console.log(postReq);
  $("#player-wait-modal").modal({ backdrop: "static", keyboard: false });
  $.post(postReq, function(data) {
    console.log(data);
  });
});
