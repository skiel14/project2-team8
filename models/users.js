module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("User", {
    username: DataTypes.STRING,
    score: DataTypes.INTEGER,
    gameId: DataTypes.STRING,
    currentRound: DataTypes.INTEGER
  });
  return Users;
};
