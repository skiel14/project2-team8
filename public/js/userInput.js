$("#joinGame").click(function(event) {
  event.preventDefault();
  var postReq =
    "/api/user/create/" +
    $("#username-box")
      .val()
      .trim();
  console.log(postReq);
  $.post(postReq, function(data) {
    console.log(data);
  });
});
