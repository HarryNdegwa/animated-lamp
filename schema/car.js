const { gql } = require("apollo-server-express");
const { fetchUser } = require("../util/user");

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

  type CarResponse {
    id: ID!
    name: String!
    make: String!
    model: String!
    year: String!
    images: [String]
    location: String
  }

  type SingleCarResponse {
    id: ID!
    name: String!
    make: String!
    model: String!
    year: String!
    images: [String]
    location: String
    UserId: Int
    owner: User
    me: User
  }

  extend type Query {
    car(id: ID!): SingleCarResponse
    cars: [CarResponse]
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
    updateCar(input: CarInput, carId: Int): String
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
            where: { id: parseInt(id, 10) },
          });
          if (car) {
            car.images = car.images.slice(0, 2);
          }
        } else {
          car = await db.Car.findOne({ where: { id: parseInt(id, 10) } });
        }

        return car;
      } catch (error) {
        console.log(`error`, error);
        res.status(400).send("Bad request!");
      }
    },
  },

  SingleCarResponse: {
    owner: async (root, args, { db }, info) => await fetchUser(root.UserId, db),
    me: async (root, args, { db, req }, info) =>
      await fetchUser(req.userId, db),
  },

  Mutation: {
    async addCar(root, { input }, { db, req, res }, info) {
      try {
        const payload = { ...input, UserId: req.userId };

        await db.Car.create({
          ...payload,
        });

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
