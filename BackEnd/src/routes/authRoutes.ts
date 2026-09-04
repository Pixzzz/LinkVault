import { Router } from "express";
import * as authController from "../controllers/authController";
import authenticate from "../middlewares/authenticate";
import validate from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validators/authSchemas";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

export default router;

