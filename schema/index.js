const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { merge } = require("lodash");
const { resolvers: carResolvers, schema: carSchema } = require("./car");
const { resolvers: userResolvers, schema: userSchema } = require("./user");

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [Query, carSchema, userSchema],
  resolvers: merge(carResolvers, userResolvers),
});
