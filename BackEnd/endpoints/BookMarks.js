const express = require("express");
const router = express.Router();
const BookMarks = require("../models/BookMark.js");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/auth.js");

// Get all bookmarks for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid({
        userId: new mongoose.Types.ObjectId(userId),
      })
    ) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const bookMarks = await BookMarks.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(bookMarks);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching BookMarks: ${error.message}` });
  }
});

// Add a new bookmark
router.post("/postBookMarks", auth, async (req, res) => {
  try {
    const { Title, Description, URL, tags } = req.body;

    if (!Title || !Description || !URL) {
      return res.status(400).json({
        message: "You must prove Title, Description and URL to add a bookmark",
      });
    }
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }
    if (tags && tags.length > 7) {
      return res
        .status(400)
        .json({ message: "A bookmark can only contain a max of 7 tags" });
    }

    const NewBookMark = await BookMarks.create({
      Title,
      Description,
      URL,
      tags: tags || [],
    });
    return res
      .status(201)
      .json({ message: "BookMark added successfully", data: NewBookMark });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error adding BookMark: ${error.message}` });
  }
});

// update a bookmark
router.patch("/updateBookMarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the bookmark ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bookmark ID" });
    }
    const allowedUpdates = ["Title", "Description", "URL", "tags"];
    const updates = {};

    allowedUpdates.forEach((fields) => {
      if (req.body[fields] !== undefined) {
        updates[fields] = req.body[fields];
      }
    });
    if (!updates.tags !== !Array.isArray(updates.tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }
    const updatedBookMark = await BookMarks.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!updatedBookMark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    return res.status(200).json({
      message: "bookmark updated successfully",
      data: updatedBookMark,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating BookMark: ${error.message}` });
  }
});

// delete a bookmark
router.delete("/deleteBookMarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bookmark ID" });
    }
    const deleteBookMark = await BookMarks.findByIdAndDelete(id);
    if (!deleteBookMark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    return res
      .status(200)
      .json({ message: "Bookmark deleted successfully", data: deleteBookMark });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting BookMark: ${error.message}` });
  }
});

module.exports = router;
