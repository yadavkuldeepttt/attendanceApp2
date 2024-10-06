const express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken');
const { logAttendance, getAttendanceForMonth } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/log', authenticateToken, logAttendance);
router.get('/getAttendance',authenticateToken,getAttendanceForMonth)

module.exports = router;
