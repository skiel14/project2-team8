module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("User", {
    username: DataTypes.STRING,
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    pair: { type: DataTypes.BOOLEAN, defaultValue: false },
    gameId: DataTypes.STRING,
    currentRound: DataTypes.INTEGER
  });
  return Users;
};
