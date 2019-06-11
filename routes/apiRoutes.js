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
      db.Games.max("id").then(function(game) {
        console.log(game);
      });
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
    db.User.findOne({ where: { id: req.params.id } }).then(function(User) {
      User.update({ score: req.params.score });
      res.json(User);
    });
  });

  //Sequelize test
  app.post("/api/seq/test", function(req, res) {
    db.User.create({
      username: "TestUserNOTATION22",
      Game: { id: 1 },
      include: db.Games
    }).then(function(user) {
      res.json(user);
    });
  });

  //Sequelize test 2
  app.post("/api/seq/test2", function(req, res) {
    db.User.findById(1).then(function(user) {
      user.setGame(1);
    });
  });
};
