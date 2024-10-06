const express = require('express');
const { getUserDetails, getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authenticateToken');


const router = express.Router();


router.get('/users/:id', authenticateToken, getUserDetails); // Protected route to get user info by ID
// Route to get all users (Protected route)
router.get('/allUsers', getAllUsers);

module.exports = router;
