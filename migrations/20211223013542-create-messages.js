'use strict';

const users = require("../models/users");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      user_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'users',
          key:'id'
        }

      },
      chat_id:{
        type:Sequelize.INTEGER,
        references:{
          model:'chats',
          key:'id'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};