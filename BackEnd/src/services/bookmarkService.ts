import type { Types } from "mongoose";
import Bookmark, { type BookmarkDocument } from "../models/Bookmark";
import type {
  BookmarkInput,
  BookmarkUpdateInput,
  ListBookmarksQuery,
} from "../validators/bookmarkSchemas";
import AppError from "../utils/AppError";
import buildBookmarkFilter from "../utils/bookmarkFilter";
import getPagination, {
  createPaginationMetadata,
  type PaginatedResult,
} from "../utils/pagination";

export const listBookmarks = async (
  ownerId: Types.ObjectId,
  query: ListBookmarksQuery,
): Promise<PaginatedResult<BookmarkDocument>> => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildBookmarkFilter({
    ownerId,
    ...(query.tag ? { tag: query.tag } : {}),
    ...(query.search ? { search: query.search } : {}),
  });

  const [bookmarks, total] = await Promise.all([
    Bookmark.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Bookmark.countDocuments(filter),
  ]);

  return {
    data: bookmarks,
    pagination: createPaginationMetadata(page, limit, total),
  };
};

export const createBookmark = (
  ownerId: Types.ObjectId,
  input: BookmarkInput,
): Promise<BookmarkDocument> => Bookmark.create({ ...input, owner: ownerId });

export const getOwnedBookmark = async (
  bookmarkId: string,
  ownerId: Types.ObjectId,
): Promise<BookmarkDocument> => {
  const bookmark = await Bookmark.findOne({ _id: bookmarkId, owner: ownerId });

  if (!bookmark) {
    throw new AppError(404, "Bookmark not found");
  }

  return bookmark;
};

export const updateBookmark = async (
  bookmarkId: string,
  ownerId: Types.ObjectId,
  updates: BookmarkUpdateInput,
): Promise<BookmarkDocument> => {
  const bookmark = await Bookmark.findOneAndUpdate(
    { _id: bookmarkId, owner: ownerId },
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!bookmark) {
    throw new AppError(404, "Bookmark not found");
  }

  return bookmark;
};

export const deleteBookmark = async (
  bookmarkId: string,
  ownerId: Types.ObjectId,
): Promise<void> => {
  const bookmark = await Bookmark.findOneAndDelete({ _id: bookmarkId, owner: ownerId });

  if (!bookmark) {
    throw new AppError(404, "Bookmark not found");
  }
};
