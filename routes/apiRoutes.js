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
    db.User.create({ username: req.params.username }).then(function(dbUser) {
      res.json(dbUser);
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
        User.update({ pair: true });
      });
      res.json(User);
    });
  });

  //Update Scores
  app.post("/api/user/:gameid/:id/:score", function(req, res) {
    db.User.find({ where: { id: req.params.id } }).then(function(User) {
      User.update({ score: req.params.score });
    });
  });
};
