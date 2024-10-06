require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db"); // Import DB connection
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const attendanceRoutes = require("./routes/attendanceRoutes"); // Import attendance routes
const adminRoutes = require("./routes/adminRoutes"); // Import auth routes
const resetPasswordRoutes = require("./routes/resetPasswordRoutes"); // Import auth routes
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("./middleware/authenticateToken");
const {
  authenticateAdminToken,
} = require("./middleware/authenticateAdminToken");
const User = require("./models/User");

// Express app setup
const app = express();
app.use(bodyParser.json());
// Add this to parse incoming JSON data
app.use(express.json());
app.use(cors());
// Middleware to parse URL-encoded form data (for forms or multipart requests)
app.use(express.urlencoded({ extended: true }));

// connect database
connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// for otp
app.use("/admin", resetPasswordRoutes);
app.use("/api", userRoutes); //user routes
app.use("/api/attendance", attendanceRoutes);
// Protecting a route
app.get("/protected-route", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the protected route!", user: req.user });
});

app.get("/protected-route-admin", authenticateAdminToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the protected route!", admin: req.admin });
});

// Setup multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile/'); // Save files to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

// Configure Multer for image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/profile'); // Update this path as needed
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
//   },
// });

// Create multer instance
const upload = multer({ storage });

// Protected route to update user details
app.put(
  "/update-user/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    console.log("====================================");
    console.log(id);
    console.log("====================================");
    const { username, email, role, mobile, address } = req.body;
    let image;

 // Get the image path if the image was uploaded
 const imagePath = req.file ? req.file.path : null; // Save path if a file was uploaded

    console.log("====================================");
    console.log(
      "Data received:",
      username,
      email,
      image,
      role,
      mobile,
      address
    );
    console.log("====================================");

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, image:imagePath, role, mobile, address },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
// Serve static files from the 'uploads' folder
app.use('/uploads/profile', express.static('uploads/profile'));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
