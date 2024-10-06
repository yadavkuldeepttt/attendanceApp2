const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');


// Login controller
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
  console.log(password);
  
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    try {
      // Check if admin exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

          // Generate token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
      });

      console.log(token,"token");
  
      // Return success response
      res.status(200).json({ message: 'Login successful',token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { adminLogin };
  

