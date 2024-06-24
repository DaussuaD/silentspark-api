const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const config = {
  secret: env.parsed.SECRET,
};
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  let tokenHeader = req.headers["authorization"];
  if (!tokenHeader) {
    return res.status(403).send({
      auth: false,
      message: "Error",
      errors: "No token provided",
    });
  }
  if (tokenHeader.split(" ")[0] !== "Bearer") {
    return res.status(500).send({
      auth: false,
      message: "Error",
      errors: "Incorrect token format",
    });
  }



  let token = tokenHeader.split(" ")[1];
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: "Error",
        errors: err,
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
