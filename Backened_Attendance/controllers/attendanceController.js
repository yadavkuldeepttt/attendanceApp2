const Attendance = require("../models/Attendance");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log(`Saving file: ${file.originalname}`);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

console.log(storage, "storage");

const upload = multer({ storage }).single("selfie"); // Adjusted to 'selfie'
console.log(upload, "upload");

const logAttendance = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res
        .status(500)
        .json({ message: "Error uploading photo", error: err });
    }

    const { status, latitude, longitude } = req.body;
    console.log("Status:", status, "Location:", latitude, longitude);
    console.log("File:", req.file); // Log file details for debugging

    const user = req.user; // Assuming user is decoded from JWT
    console.log("User:", user);

    if (
      !status ||
      (status !== "IN" &&
        status !== "OUT" &&
        status !== "Leave" &&
        status !== "Absent")
    ) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    // Initialize selfie path as null for statuses that are not "IN"
    let selfiePath = null;

    // Handle selfie logic only if the status is "IN"
    if (status === "IN") {
      console.log("Processing 'IN' status");
      selfiePath = req.file ? req.file.path : null; // Save selfie if status is IN
    } else {
      console.log(`Processing status: ${status}, no selfie needed.`);
    }

    // Save the attendance in the database (MongoDB)
    try {
      const parsedLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      const attendanceLog = new Attendance({
        userId: user.id,
        status,
        location: {
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude,
        },
        selfie: selfiePath, // Store the file path
        date: new Date().toISOString().split("T")[0], // Store the exact date in YYYY-MM-DD format
        timestamp: new Date(), // Store the exact time of attendance
      });

      console.log("Attendance Log:", attendanceLog);

      console.log("Before saving attendanceLog...");
      await attendanceLog.save();
      console.log("After saving attendanceLog...");

      res.status(200).json({
        message: `Attendance ${status} logged successfully`,
        attendance: attendanceLog,
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      res.status(500).json({ message: "Error logging attendance", error });
    }
  });
};

const getAttendanceForMonth = async (req, res) => {
  const user = req.user; // This is the user decoded from the JWT token

  const { month, year } = req.query;

  console.log(month);
  console.log(year);

  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const attendanceLogs = await Attendance.find({
      userId: user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    console.log(attendanceLogs,"attendance logs feteeched");
    

    res.status(200).json(attendanceLogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance logs", error });
  }
};

module.exports = { logAttendance, getAttendanceForMonth };
