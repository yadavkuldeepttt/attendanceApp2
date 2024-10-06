const express = require('express');

const User = require("../models/User"); // Assuming you're using Mongoose or similar ORM



const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    

    // Return the necessary user information (like name and email)
    res.status(200).json({
      username: user.username,
      email: user.email,
      image:user.image,
      role: user.role || "",
      mobile: user.mobile || "",
      address: user.address || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find(); // This fetches all users

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the necessary user information (like name and email) for each user
    const userData = users.map((user) => ({
      username: user.username,
      email: user.email,
      image: user.image || "",
      role: user.role || "",
      mobile: user.mobile || "",
      address: user.address || "",
    }));
    console.log(userData, "users");

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user list", error });
  }
};


module.exports = { getUserDetails, getAllUsers };
