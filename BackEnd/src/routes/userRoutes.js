const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const {
  listUsersSchema,
  updateRoleSchema,
  deleteUserSchema,
} = require("../validators/userSchemas");

const router = express.Router();

router.use(authenticate, authorize("admin"));
router.get("/", validate(listUsersSchema), userController.list);
router.patch("/:id/role", validate(updateRoleSchema), userController.updateRole);
router.delete("/:id", validate(deleteUserSchema), userController.remove);

module.exports = router;

