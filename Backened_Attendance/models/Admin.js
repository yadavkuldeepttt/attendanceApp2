const mongoose = require('mongoose');

// User schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the User model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
