const { gql } = require("apollo-server-express");

exports.schema = gql`
  type Car {
    id: ID!
    name: String!
    make: String!
    model: String!
    year: String!
    images: [String]
    location: String!
  }

  extend type Query {
    car(id: ID!): Car
    cars: [Car]
  }

  input CarInput {
    name: String!
    make: String!
    model: String!
    year: String!
    images: [String]
    location: String!
  }

  extend type Mutation {
    addCar(input: CarInput): String
    updateCar(input: CarInput): String
  }
`;

exports.resolvers = {
  Query: {
    async cars(root, args, { db, res, req }, info) {
      try {
        let cars;

        if (!req.userId) {
          cars = await db.Car.findAll({
            attributes: { exclude: ["location"] },
          });
        } else {
          cars = await db.Car.findAll();
        }

        return cars;
      } catch (error) {
        console.log(`error`, error);
        res.status(400).send("Bad request!");
      }
    },

    async car(root, { id }, { db, res, req }, info) {
      try {
        let car;

        if (!req.userId) {
          car = await db.Car.findOne({
            attributes: { exclude: ["location"] },
            where: { id },
          });
          if (car) {
            car.images = car.images.slice(0, 2);
          }
        } else {
          car = await db.Car.findOne({ where: { id } });
        }

        return car;
      } catch (error) {
        console.log(`error`, error);
        res.status(400).send("Bad request!");
      }
    },
  },

  Mutation: {
    async addCar(root, { input }, { db, req, res }, info) {
      try {
        const payload = { ...input, UserId: req.userId };

        // await db.Car.create({
        //   ...payload,
        // });

        return "Success!";
      } catch (error) {
        console.log(`error`, error);
        res.status(400).send("Bad request!");
      }
    },

    async updateCar(root, { input, carId }, { db, req, res }, info) {
      try {
        const payload = { ...input };

        await db.Car.update(payload, {
          where: {
            id: carId,
          },
        });

        return "Success!";
      } catch (error) {
        console.log(`error`, error);
        res.status(400).send("Bad request!");
      }
    },
  },
};
