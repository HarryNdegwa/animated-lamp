const db = require("../models");

const Car = db.Car;

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findOne({ where: { id } });
    if (car.UserId !== req.userId) {
      return res.status(400).send("Bad Request!");
    }
    req.carID = id;
    next();
  } catch (error) {
    console.log(`error`, error);
    return res.status(400).send("Bad request!");
  }
};
