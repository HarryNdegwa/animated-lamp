const { gql } = require("apollo-server-express");

exports.schema = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    # chatUsers:[]
  }

  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  extend type Mutation {
    register: User
  }
`;

exports.resolvers = {
  Query: {},

  Mutation: {},
};
