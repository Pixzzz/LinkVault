const bookmarkService = require("../services/bookmarkService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const result = await bookmarkService.listBookmarks(
    req.user.id,
    req.validated.query,
  );
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.createBookmark(req.user.id, req.body);
  res.status(201).json({ data: bookmark });
});

const getById = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.getOwnedBookmark(
    req.validated.params.id,
    req.user.id,
  );
  res.json({ data: bookmark });
});

const update = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.updateBookmark(
    req.validated.params.id,
    req.user.id,
    req.body,
  );
  res.json({ data: bookmark });
});

const remove = asyncHandler(async (req, res) => {
  await bookmarkService.deleteBookmark(req.validated.params.id, req.user.id);
  res.status(204).send();
});

module.exports = { list, create, getById, update, remove };

