const express = require('express');
const { signup ,login, changePassword} = require('../controllers/authControllers');


const router = express.Router();

// Route for signup
router.post('/signup', signup);
router.post('/login',login);
router.post('/change-password',changePassword);


module.exports = router;
