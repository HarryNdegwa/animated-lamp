"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Chat);
    }
  }
  ChatInfo.init(
    {
      user1: DataTypes.INTEGER,
      user2: DataTypes.INTEGER,
      chatId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChatInfo",
    }
  );
  return ChatInfo;
};
