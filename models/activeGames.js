module.exports = function(sequelize, DataTypes) {
  var Games = sequelize.define("Games", {
    currentRound: { type: DataTypes.INTEGER, defaultValue: 0 },
    complete: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  // Games.associate = function(models) {
  //  models.Games.hasMany(models.Users);
  // };
  return Games;
};
