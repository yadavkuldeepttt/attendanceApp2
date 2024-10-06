const express = require('express');
const { requestOTP, verifyOTP } = require('../controllers/resetPasswordController');


const router = express.Router();

// Route 
router.post('/request-otp',requestOTP);
router.post('/verify-otp',verifyOTP);
router.post('/reset-password',verifyOTP);




module.exports = router;
