const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bycrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// UserSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("password")) return next();
//     const salt = await bycrypt.genSalt(10);
//     this.password = await bycrypt.hash(this.password, salt);
//     next();
//   } catch (error) {}
// });

module.exports = mongoose.model("User", UserSchema);
