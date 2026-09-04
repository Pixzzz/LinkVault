const User = require("../models/User");
const Bookmark = require("../models/Bookmark");
const AppError = require("../utils/AppError");
const getPagination = require("../utils/pagination");

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return {
    data: users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const updateUserRole = async (userId, role, actingUserId) => {
  if (String(userId) === String(actingUserId)) {
    throw new AppError(400, "Administrators cannot change their own role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const deleteUser = async (userId, actingUserId) => {
  if (String(userId) === String(actingUserId)) {
    throw new AppError(400, "Administrators cannot delete their own account");
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  await Bookmark.deleteMany({ owner: userId });
};

module.exports = { listUsers, updateUserRole, deleteUser };
