const mongoose = require("mongoose");

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidHttpUrl,
        message: "URL must use http or https",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 7,
        message: "A bookmark can contain at most 7 tags",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(document, returnedObject) {
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

bookmarkSchema.index({ owner: 1, createdAt: -1 });
bookmarkSchema.index({ owner: 1, tags: 1 });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
