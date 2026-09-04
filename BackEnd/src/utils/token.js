const jwt = require("jsonwebtoken");
const config = require("../config/env");

const createAccessToken = (user) =>
  jwt.sign(
    { sub: String(user._id) },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );

module.exports = createAccessToken;

