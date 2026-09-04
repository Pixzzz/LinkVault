import mongoose, { type HydratedDocument, Schema, type Types } from "mongoose";

export interface IBookmark {
  title: string;
  description: string;
  url: string;
  tags: string[];
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type BookmarkDocument = HydratedDocument<IBookmark>;

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const bookmarkSchema = new Schema<IBookmark>(
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
        validator: (tags: string[]): boolean => tags.length <= 7,
        message: "A bookmark can contain at most 7 tags",
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returnedObject): Record<string, unknown> => {
        const sanitized = returnedObject as Record<string, unknown>;
        delete sanitized.__v;
        return sanitized;
      },
    },
  },
);

bookmarkSchema.index({ owner: 1, createdAt: -1 });
bookmarkSchema.index({ owner: 1, tags: 1 });

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default Bookmark;
