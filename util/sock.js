const db = require("../models");

const Chat = db.Chat;

module.exports = (io) => {
  io.on("connection", (socket) => {
    /* socket object may be used to send specific messages to the new connected client */
    console.log(`Client connected`);
    // socket.emit("connection", () => {
    //   console.log(`One client Connected`);
    // });

    socket.on("getMessages", async (data) => {
      const messages = await Chat.findAll({
        where: {
          chatId: data.activeChatId,
        },
      });
      socket.emit("messages", messages);
    });

    socket.on("newMessage", async (data) => {
      const message = await Chat.create({
        ...data,
      });
      io.sockets.emit("message", message);
    });
  });
};
