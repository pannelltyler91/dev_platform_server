'use strict';
const Sequelize = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    github: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    portfolio: DataTypes.STRING,
    currentLanguages: DataTypes.ARRAY(Sequelize.TEXT),
    newLanguages: DataTypes.ARRAY(Sequelize.TEXT),
    pic:DataTypes.STRING,
    banner:DataTypes.STRING,
    pic_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};