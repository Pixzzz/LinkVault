import { Router } from "express";
import * as userController from "../controllers/userController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";
import validate from "../middlewares/validate";
import {
  listUsersSchema,
  updateRoleSchema,
  deleteUserSchema,
} from "../validators/userSchemas";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/", validate(listUsersSchema), userController.list);
router.patch("/:id/role", validate(updateRoleSchema), userController.updateRole);
router.delete("/:id", validate(deleteUserSchema), userController.remove);

export default router;

