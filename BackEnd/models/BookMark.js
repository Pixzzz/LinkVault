const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookMarkSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (tags) {
        return tags.length <= 7;
      },
      message: "A bookmark can have a maximum of 7 tags.",
    },
  },
});

module.exports = mongoose.model("BookMark", BookMarkSchema);
