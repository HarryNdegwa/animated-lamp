const { gql } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const ShortUniqueId = require("short-unique-id");

const { SECRET_KEY } = require("../constants");

exports.schema = gql`
  type ChatUser {
    userId: Int!
    chatId: String!
  }

  type AuthResponse {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    chatUsers: [ChatUser]
  }

  extend type Query {
    user(id: ID!): User
    users: [User]
    getNewChatUsers: [User]
    me: User
    getChatUsers: [User]
    createNewChat: String
  }

  input UserInput {
    username: String!
    password: String!
  }

  extend type Mutation {
    register(input: UserInput): AuthResponse!
    login(input: UserInput): AuthResponse!
  }
`;

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: 86400,
  });
};

const fetchUser = (id) => {
  return User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
};

exports.resolvers = {
  Query: {},

  Mutation: {
    async login(root, { input }, { db, req, res }, info) {
      try {
        const user = await db.User.findOne({
          where: {
            username: input.username,
          },
        });

        if (!user) {
          res.status(400).send("Invalid credentials!");
          return;
        }

        const isPasswordValid = bcrypt.compareSync(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          res.status(400).send("Wrong Password!");
          return;
        }

        return {
          token: generateToken(user),
        };
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },

    async register(root, { input }, { db, res, req }, info) {
      try {
        const data = await db.User.create({
          username: input.username,
          password: bcrypt.hashSync(input.password, 8),
        });

        if (data.id) {
          return {
            token: generateToken(data),
          };
        }
      } catch (error) {
        console.log(`error`, error);
        if (error.parent.detail) {
          res.status(400).send("Username already exists!");
        } else {
          res.status(500).send("Something is wrong!");
        }
      }
    },
  },
};
