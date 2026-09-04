import type { Types } from "mongoose";
import User, { type UserDocument, type UserRole } from "../models/User";
import Bookmark from "../models/Bookmark";
import type { ListUsersQuery } from "../validators/userSchemas";
import AppError from "../utils/AppError";
import getPagination, {
  createPaginationMetadata,
  type PaginatedResult,
} from "../utils/pagination";

export const listUsers = async (
  query: ListUsersQuery,
): Promise<PaginatedResult<UserDocument>> => {
  const { page, limit, skip } = getPagination(query);
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return {
    data: users,
    pagination: createPaginationMetadata(page, limit, total),
  };
};

export const updateUserRole = async (
  userId: string,
  role: UserRole,
  actingUserId: Types.ObjectId,
): Promise<UserDocument> => {
  if (userId === String(actingUserId)) {
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

export const deleteUser = async (
  userId: string,
  actingUserId: Types.ObjectId,
): Promise<void> => {
  if (userId === String(actingUserId)) {
    throw new AppError(400, "Administrators cannot delete their own account");
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  await Bookmark.deleteMany({ owner: userId });
};
