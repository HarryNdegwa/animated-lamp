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

  extend type Mutation {
    addCar: Car
  }
`;

exports.resolvers = {
  Query: {},

  Mutation: {},
};
