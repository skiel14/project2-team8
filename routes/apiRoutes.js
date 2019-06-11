var gameID;
var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  // Create new user
  app.post("/api/user/create/:username", function(req, res) {
    db.Games.max("id").then(function(idgamenum) {
      gameID = idgamenum;
      db.User.create({ username: req.params.username, gameId: gameID }).then(
        function(dbUser) {
          res.json(dbUser);
        }
      );
    });
  });

  // Check User Queue
  app.post("/api/user/queue", function(req, res) {
    db.User.findAll({ where: { pair: false } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Start Game
  app.post("/api/game/start", function(req, res) {
    db.User.findAll({ where: { pair: false } }).then(function(User) {
      User.forEach(function(User) {
        User.update({ pair: true }).then(function() {
          db.Games.create({});
        });
      });
      res.json(User);
    });
  });

  //Update Scores
  app.post("/api/user/:gameid/:id/:score", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(User) {
      User.update({ score: req.params.score });
      res.json(User);
    });
  });

  //Pull all scores
  app.post("/api/game/score/:gameid", function(req, res) {
    db.User.findAll({ where: { gameId: req.params.gameid } }).then(function(
      scores
    ) {
      res.json(scores);
    });
  });

  //Sequelize test
  app.post("/api/seq/test", function(req, res) {
    db.Games.create({}).then(function(user) {
      res.json(user);
    });
  });
};
