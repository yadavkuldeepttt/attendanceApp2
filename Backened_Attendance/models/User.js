const mongoose = require("mongoose");


// User schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "Emnployee",
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
