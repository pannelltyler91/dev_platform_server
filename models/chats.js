'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  chats.init({
    user1: DataTypes.STRING,
    user2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chats',
  });
  return chats;
};