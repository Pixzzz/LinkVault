import { Router } from "express";
import * as bookmarkController from "../controllers/bookmarkController";
import authenticate from "../middlewares/authenticate";
import validate from "../middlewares/validate";
import {
  createBookmarkSchema,
  updateBookmarkSchema,
  bookmarkIdSchema,
  listBookmarksSchema,
} from "../validators/bookmarkSchemas";

const router = Router();

router.use(authenticate);
router.get("/", validate(listBookmarksSchema), bookmarkController.list);
router.post("/", validate(createBookmarkSchema), bookmarkController.create);
router.get("/:id", validate(bookmarkIdSchema), bookmarkController.getById);
router.patch("/:id", validate(updateBookmarkSchema), bookmarkController.update);
router.delete("/:id", validate(bookmarkIdSchema), bookmarkController.remove);

export default router;

