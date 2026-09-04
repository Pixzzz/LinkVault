const express = require("express");
const authRoutes = require("./authRoutes");
const bookmarkRoutes = require("./bookmarkRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/users", userRoutes);

module.exports = router;
