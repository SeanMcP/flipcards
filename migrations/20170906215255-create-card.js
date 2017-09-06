'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      front: {
        allowNull: false,
        type: Sequelize.STRING
      },
      back: {
        allowNull: false,
        type: Sequelize.STRING
      },
      deckId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Decks',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Cards');
  }
};
