const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const config = require("./config.json");
const BookMarks = require("./endpoints/BookMarks.js");
const User = require("./endpoints/user.js");
const app = express();
const port = 3000;

dotenv.config();
console.log(process.env);
app.use(express.json());
mongoose.connect(config.connectionString);

app.use(express.json());
app.use("/bookmarks", BookMarks);
app.use("/users", User);

app.get("/", (req, res) => {
  res.json({ message: "Hello World, this backend working for LinkVault" });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
