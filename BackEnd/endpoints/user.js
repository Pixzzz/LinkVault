const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");

// Create a new user
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error fetching users: ${error.message}` });
  }
});

// Login user 
router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;
  } catch (error) {

  }
})

// Create a new user
router.post("/user", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password must be provided" });
    }

    const createdUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (createdUser) {
      return res.status(400).json({
        message: "A user with the same email or username already exists",
      });
    }
    const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
});

// edit user details
router.put("/user/:userId", async (req, res) => {
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

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    await updatedUser.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user: ${error.message}` });
  }
});

// delete user
router.delete("/user/:userId", async (req, res) => {
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
