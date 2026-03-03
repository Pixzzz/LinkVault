const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");
const validation = require("../middleware/validation.js");

// GET: Fetch all users
router.get("/user", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);
    const total = await User.countDocuments();
    return res
      .status(200)
      .json({ data: users, pagination: { total, page, limit } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error fetching users: ${error.message}` });
  }
});

// POST: Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password must be provided",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return res
      .status(200)
      .json({ message: "Login successful", email: user.email, token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error logging in: ${error.message}` });
  }
});

// POST: Create a new user
router.post("/user", auth, validation, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "username, email and password must be provided" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const createdUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    
    if (createdUser) {
      return res.status(409).json({
        message: "A user with the same email or username already exists",
      });
    }
    const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    return res
      .status(201)
      .json({ message: "User created successfully", data: userResponse });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res
        .status(409)
        .json({ message: `A user with the same ${field} already exists` });
    }
    return res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
});

// PUT: Edit user details
router.put("/user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== updatedUser.email) {
      const isEmailExists = await User.findOne({ email: email });
      if (isEmailExists) {
        return res
          .status(400)
          .json({ message: "A user with the same email already exists" });
      }
      updatedUser.email = email;
    }
    if (username && username !== updatedUser.username) {
      const isUsernameExists = await User.findOne({ username: username });
      if (isUsernameExists) {
        return res
          .status(400)
          .json({ message: "A user with the same username already exists" });
      }
      updatedUser.username = username;
    }
    if (password) {
      updatedUser.password = await bycrypt.hash(password, 10);
    }

    await updatedUser.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    return res
      .status(200)
      .json({ message: "User updated successfully", data: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user: ${error.message}` });
  }
});

// DELETE: Delete a user
router.delete("/user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error deleting user: ${error.message}` });
  }
});

module.exports = router;
