"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
    }
  }
  Car.init(
    {
      name: DataTypes.STRING,
      make: DataTypes.STRING,
      model: DataTypes.STRING,
      year: DataTypes.STRING,
      images: { type: DataTypes.ARRAY(DataTypes.STRING) },
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  return Car;
};
