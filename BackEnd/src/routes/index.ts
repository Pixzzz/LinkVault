import { Router } from "express";
import authRoutes from "./authRoutes";
import bookmarkRoutes from "./bookmarkRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/users", userRoutes);

export default router;
