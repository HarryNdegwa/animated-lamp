const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants");

module.exports = (req, res, next) => {
  try {
    const rawToken = req.headers["authorization"]; // Bearer .....

    if (rawToken) {
      const [_, token] = rawToken.split(" ");

      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send("Not authorised!");
        }

        req.userId = decoded.id;
        next();
      });
    } else {
      if (
        req.originalUrl === "/v1/cars" ||
        req.originalUrl.includes("/v1/car")
      ) {
        req.userId = null;
        next();
      } else {
        throw new Error("");
      }
    }
  } catch (error) {
    console.log(`error`, error);
    return res.status(401).send("Not authorised!");
  }
};
