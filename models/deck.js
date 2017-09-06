'use strict'
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {})

  Deck.associate = function(models) {
    Deck.belongsTo(models.User, {
      as: "user",
      foreignKey: 'userId'
    })

    Deck.hasMany(models.Card, {
      as: "cards",
      foreignKey: 'deckId'
    })
  }

  return Deck
}
