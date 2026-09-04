const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const {
  createBookmarkSchema,
  updateBookmarkSchema,
  bookmarkIdSchema,
  listBookmarksSchema,
} = require("../validators/bookmarkSchemas");

const router = express.Router();

router.use(authenticate);
router.get("/", validate(listBookmarksSchema), bookmarkController.list);
router.post("/", validate(createBookmarkSchema), bookmarkController.create);
router.get("/:id", validate(bookmarkIdSchema), bookmarkController.getById);
router.patch("/:id", validate(updateBookmarkSchema), bookmarkController.update);
router.delete("/:id", validate(bookmarkIdSchema), bookmarkController.remove);

module.exports = router;

