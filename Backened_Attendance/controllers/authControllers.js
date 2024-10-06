const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, password, confirmPassword, username } = req.body;

  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  console.log(username);

  try {
    // Basic validation
    if (!email || !password || !confirmPassword || !username) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    console.log(token, "token");

    return res
      .status(201)
      .json({ message: "User created successfully", token });
  } catch (error) {
    // Log the error for server-side visibility
    console.error("Error during signup:", error);

    // Handle different error cases with specific messages
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data format" });
    }

    if (error.code === 11000) {
      // Handle MongoDB duplicate key error for unique email field
      return res.status(400).json({ message: "Email already registered" });
    }

    // General error catch-all
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    console.log(token, "token");

    // Return success response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password Route
const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Find the user by userId (assuming you're passing the user ID)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

module.exports = { signup, login, changePassword };
