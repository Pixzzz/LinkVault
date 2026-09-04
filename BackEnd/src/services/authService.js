const bcrypt = require("bcrypt");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const createAccessToken = require("../utils/token");

const register = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new AppError(409, "A user with that email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashedPassword });

  return { user, accessToken: createAccessToken(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  const passwordMatches = user && (await bcrypt.compare(password, user.password));

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  user.password = undefined;
  return { user, accessToken: createAccessToken(user) };
};

module.exports = { register, login };

