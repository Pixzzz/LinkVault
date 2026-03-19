const express = require("express");
const mongoose = require("mongoose");
const config = require('./config.js')
const BookMarks = require("./endpoints/BookMarks.js");
const User = require("./endpoints/user.js");
const app = express();

mongoose.connect(config.mongodb.uri);
app.use(express.json());
app.use("/bookmarks", BookMarks);
app.use("/users", User);

app.get("/", (req, res) => {
  res.json({ message: "Hello World, this backend is working for LinkVault" });
});
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});