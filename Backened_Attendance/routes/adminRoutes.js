const express = require('express');
const { adminLogin } = require('../controllers/adminController');


const router = express.Router();

// Route for signup
router.post('/login',adminLogin);


module.exports = router;
