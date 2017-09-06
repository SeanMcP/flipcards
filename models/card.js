'use strict'
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    front: DataTypes.STRING,
    back: DataTypes.STRING,
    deckId: DataTypes.INTEGER
  }, {})

  Card.associate = function(models) {
    Card.belongsTo(models.Deck, {
      as: 'card',
      foreignKey: 'deckId'
    })
  }

  return Card
}
