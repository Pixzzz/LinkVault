const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookMarkSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  URL: { type: String, required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  CreatedAt: { type: Date, default: Date.now },
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
