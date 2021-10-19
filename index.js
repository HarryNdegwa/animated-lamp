const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const userRoutes = require("./routes/users");
const carRoutes = require("./routes/cars");
const db = require("./models/index");
const sock = require("./util/sock");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
// const CarResolver = require("./resolvers/carResolvers");
const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
// if (process.env.NODE_ENV !== "production") {
// }

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
// }

const httpServer = http.createServer(app); // This is the http server

const io = socketio(httpServer, {
  cors: {
    origin: "*",
  },
});

sock(io);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return { db, req, res };
  },
});

apolloServer.applyMiddleware({ app, cors: false });

// db.sequelize.sync({ force: true });
db.sequelize.sync();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/v1", userRoutes);
app.use("/v1", carRoutes);

app.get("*", (req, res) => {
  // Catches all invalid urls
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
