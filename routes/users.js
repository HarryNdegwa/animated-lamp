const express = require("express");
const {
  register,
  login,
  getNewChatUsers,
  createNewChat,
  getChatUsers,
  me,
  getUser,
} = require("../controllers/users");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  await register(req, res);
});

router.post("/login", async (req, res) => {
  await login(req, res);
});

router.get("/me", [verifyToken], async (req, res) => {
  await me(req, res);
});

router.get("/user/:id", async (req, res) => {
  await getUser(req, res);
});

router.get("/get-new-chat-users", [verifyToken], async (req, res) => {
  await getNewChatUsers(req, res);
});

router.post("/create-new-chat/:id", [verifyToken], async (req, res) => {
  await createNewChat(req, res);
});

router.get("/get-chat-users", [verifyToken], async (req, res) => {
  await getChatUsers(req, res);
});

module.exports = router;
