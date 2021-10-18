const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");
const db = require("./models/index");
const sock = require("./util/sock");

const app = express();

if (process.env.NODE_ENV !== "production") {
  const corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

sock(io);

// db.sequelize.sync({ force: true });
db.sequelize.sync();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/v1", userRoutes);
app.use("/v1", carRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
