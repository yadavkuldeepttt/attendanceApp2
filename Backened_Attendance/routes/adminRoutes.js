const express = require('express');
const { adminLogin, getAdminDetails } = require('../controllers/adminController');
const { authenticateAdminToken } = require('../middleware/authenticateAdminToken');


const router = express.Router();

// Route for signup
router.post('/login',adminLogin);
router.get('/get-details/:id', authenticateAdminToken, getAdminDetails); // Protected route to get user info by ID



module.exports = router;
