const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['IN', 'OUT','Absent','Leave'],
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  selfie: {
    type: String, // Store the file path
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
