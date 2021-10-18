"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Car);
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      chatUsers: {
        type: DataTypes.ARRAY(DataTypes.JSON),
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
