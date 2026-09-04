import mongoose, { type HydratedDocument, Schema } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returnedObject): Record<string, unknown> => {
        const sanitized = returnedObject as Record<string, unknown>;
        delete sanitized.password;
        delete sanitized.__v;
        return sanitized;
      },
    },
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

