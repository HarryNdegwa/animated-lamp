const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const ShortUniqueId = require("short-unique-id");

const { SECRET_KEY } = require("../constants");

const db = require("../models");

const User = db.User;
const ChatInfo = db.ChatInfo;

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

exports.register = async (req, res) => {
  try {
    const data = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (data.id) {
      res.status(200).send({
        token: generateToken(data),
      });
    }
  } catch (error) {
    if (error.parent.detail) {
      res.status(400).send("Username already exists!");
    } else {
      res.status(500).send("Something is wrong!");
    }
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).send("Invalid credentials!");
      return;
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(400).send("Wrong Password!");
      return;
    }

    res.status(200).send({
      token: generateToken(user),
    });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};

exports.getNewChatUsers = async (req, res) => {
  try {
    // const user = await User.findOne({ where: { id: req.userId } });
    const user = await fetchUser(req.userId);
    if (user) {
      let newUsers;
      if (user.chatUsers instanceof Array) {
        newUsers = await User.findAll({
          where: {
            id: {
              [Op.notIn]: [req.userId, ...user.chatUsers.map((u) => u.userId)],
            },
          },
          attributes: { exclude: ["password"] },
        });
      } else {
        newUsers = await User.findAll({
          where: {
            id: { [Op.notIn]: [req.userId] },
          },
          attributes: { exclude: ["password"] },
        });
      }

      res.status(200).send(newUsers);
    }
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};
exports.me = async (req, res) => {
  try {
    // const me = await User.findOne({
    //   where: {
    //     id: req.userId,
    //   },
    // });
    const me = await fetchUser(req.userId);
    res.status(200).send(me);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};

exports.getUser = async (req, res) => {
  try {
    // const user = await User.findOne({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    const user = await fetchUser(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};

exports.createNewChat = async (req, res) => {
  try {
    const chatInfo = await ChatInfo.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: { user1: req.userId, user2: parseInt(req.params.id, 10) },
          },
          {
            [Op.and]: { user2: req.userId, user1: parseInt(req.params.id, 10) },
          },
        ],
      },
    });

    if (!chatInfo) {
      const uid = new ShortUniqueId({ length: 6 });

      const chatMetaInfo = await ChatInfo.create({
        user1: req.userId,
        user2: parseInt(req.params.id, 10),
        chatId: uid(),
      });

      const user1 = await User.findOne({ where: { id: req.userId } });
      const user2 = await User.findOne({
        where: { id: parseInt(req.params.id, 10) },
      });

      let user1ChatUsers = [];
      let user2ChatUsers = [];

      if (user1) {
        user1ChatUsers = user1.chatUsers
          ? [
              ...user1.chatUsers,
              {
                userId: parseInt(req.params.id, 10),
                chatId: chatMetaInfo.chatId,
              },
            ]
          : [
              {
                userId: parseInt(req.params.id, 10),
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

      await User.update(
        { chatUsers: user1ChatUsers },
        {
          where: {
            id: req.userId,
          },
        }
      );

      await User.update(
        { chatUsers: user2ChatUsers },
        {
          where: {
            id: parseInt(req.params.id, 10),
          },
        }
      );
    }

    // const outputUser = await User.findOne({
    //   where: { id: parseInt(req.params.id, 10) },
    // });

    const outputUser = await fetchUser(parseInt(req.params.id, 10));

    res.status(200).send(outputUser);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};

exports.getChatUsers = async (req, res) => {
  try {
    const currentUser = await User.findOne({
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

    const chatUsers = await User.findAll({
      where: { id: { [Op.in]: usersIds } },
      order: [["updatedAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.status(200).send(chatUsers);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).send("Something is wrong!");
  }
};
