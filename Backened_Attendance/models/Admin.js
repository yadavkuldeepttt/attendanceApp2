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
  role:{
    type:String
  },
  adminName:{
    type:String,
    required:true,
  },
  companyName:{
    type:String,
  },
});

// Create the User model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
