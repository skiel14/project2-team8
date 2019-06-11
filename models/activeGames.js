module.exports = function(sequelize, DataTypes) {
  var Games = sequelize.define("Games", {
    gameQuote: { type: DataTypes.STRING }
  });
  return Games;
};
