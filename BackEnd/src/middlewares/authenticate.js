const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "A Bearer access token is required");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new AppError(401, "A Bearer access token is required");
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw new AppError(401, "The access token is invalid or expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError(401, "The user associated with this token no longer exists");
  }

  req.user = user;
  next();
});

module.exports = authenticate;

