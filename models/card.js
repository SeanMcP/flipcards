'use strict'
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    front: DataTypes.STRING,
    back: DataTypes.STRING,
    deckId: DataTypes.INTEGER
  }, {})

  

  return Card
}
