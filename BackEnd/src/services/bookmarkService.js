const Bookmark = require("../models/Bookmark");
const AppError = require("../utils/AppError");
const buildBookmarkFilter = require("../utils/bookmarkFilter");
const getPagination = require("../utils/pagination");

const listBookmarks = async (ownerId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildBookmarkFilter({
    ownerId,
    tag: query.tag,
    search: query.search,
  });

  const [bookmarks, total] = await Promise.all([
    Bookmark.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Bookmark.countDocuments(filter),
  ]);

  return {
    data: bookmarks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const createBookmark = (ownerId, input) => Bookmark.create({ ...input, owner: ownerId });

const getOwnedBookmark = async (bookmarkId, ownerId) => {
  const bookmark = await Bookmark.findOne({ _id: bookmarkId, owner: ownerId });

  if (!bookmark) {
    throw new AppError(404, "Bookmark not found");
  }

  return bookmark;
};

const updateBookmark = async (bookmarkId, ownerId, updates) => {
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

const deleteBookmark = async (bookmarkId, ownerId) => {
  const bookmark = await Bookmark.findOneAndDelete({ _id: bookmarkId, owner: ownerId });

  if (!bookmark) {
    throw new AppError(404, "Bookmark not found");
  }
};

module.exports = {
  listBookmarks,
  createBookmark,
  getOwnedBookmark,
  updateBookmark,
  deleteBookmark,
};

