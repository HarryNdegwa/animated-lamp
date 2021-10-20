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
    getUser(id: ID!): User
    users: [User]
    getNewChatUsers: [User]
    me: User
    getChatUsers: [User]
  }

  input UserInput {
    username: String!
    password: String!
  }

  extend type Mutation {
    register(input: UserInput): AuthResponse!
    login(input: UserInput): AuthResponse!
    createNewChat(id: Int): User
  }
`;

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: 8640000,
  });
};

const fetchUser = (id, db) => {
  return db.User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
};

exports.resolvers = {
  Query: {
    async getNewChatUsers(root, args, { db, res, req }, info) {
      try {
        const user = await fetchUser(req.userId, db);
        if (user) {
          let newUsers;
          if (user.chatUsers instanceof Array) {
            newUsers = await db.User.findAll({
              where: {
                id: {
                  [Op.notIn]: [
                    req.userId,
                    ...user.chatUsers.map((u) => u.userId),
                  ],
                },
              },
              attributes: { exclude: ["password"] },
            });
          } else {
            newUsers = await db.User.findAll({
              where: {
                id: { [Op.notIn]: [req.userId] },
              },
              attributes: { exclude: ["password"] },
            });
          }

          //   res.status(200).send(newUsers);
          return newUsers;
        }
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },
    async me(root, args, { db, res, req }, info) {
      try {
        const me = await fetchUser(req.userId, db);
        return me;
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },

    async getUser(root, { id }, { db, res, req }, info) {
      try {
        const user = await fetchUser(id, db);
        return user;
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },
    async getChatUsers(root, args, { db, req, res }, info) {
      try {
        const currentUser = await db.User.findOne({
          where: {
            id: req.userId,
          },
        });

        let usersIds;
        if (currentUser.chatUsers instanceof Array) {
          usersIds = currentUser.chatUsers.map((u) => u.userId);
        }

        if (!usersIds) {
          usersIds = [];
        }

        const chatUsers = await db.User.findAll({
          where: { id: { [Op.in]: usersIds } },
          order: [["updatedAt", "DESC"]],
          attributes: { exclude: ["password"] },
        });

        return chatUsers;
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },
  },

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

    async createNewChat(root, { id }, { db, req, res }, info) {
      try {
        const chatInfo = await db.ChatInfo.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: { user1: req.userId, user2: parseInt(id, 10) },
              },
              {
                [Op.and]: { user2: req.userId, user1: parseInt(id, 10) },
              },
            ],
          },
        });

        if (!chatInfo) {
          const uid = new ShortUniqueId({ length: 6 });

          const chatMetaInfo = await db.ChatInfo.create({
            user1: req.userId,
            user2: parseInt(id, 10),
            chatId: uid(),
          });

          const user1 = await db.User.findOne({ where: { id: req.userId } });
          const user2 = await db.User.findOne({
            where: { id: parseInt(id, 10) },
          });

          let user1ChatUsers = [];
          let user2ChatUsers = [];

          if (user1) {
            user1ChatUsers = user1.chatUsers
              ? [
                  ...user1.chatUsers,
                  {
                    userId: parseInt(id, 10),
                    chatId: chatMetaInfo.chatId,
                  },
                ]
              : [
                  {
                    userId: parseInt(id, 10),
                    chatId: chatMetaInfo.chatId,
                  },
                ];
          }

          if (user2) {
            user2ChatUsers = user2.chatUsers
              ? [
                  ...user2.chatUsers,
                  { userId: req.userId, chatId: chatMetaInfo.chatId },
                ]
              : [{ userId: req.userId, chatId: chatMetaInfo.chatId }];
          }

          await db.User.update(
            { chatUsers: user1ChatUsers },
            {
              where: {
                id: req.userId,
              },
            }
          );

          await db.User.update(
            { chatUsers: user2ChatUsers },
            {
              where: {
                id: parseInt(id, 10),
              },
            }
          );
        }

        const outputUser = await fetchUser(parseInt(id, 10), db);

        return outputUser;
      } catch (error) {
        console.log(`error`, error);
        res.status(500).send("Something is wrong!");
      }
    },
  },
};
