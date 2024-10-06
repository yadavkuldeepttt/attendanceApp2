
// Login controller
const requestOTP = async (req, res) => {
  const { mobileNumber } = req.body;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Save OTP to database or cache (e.g., Redis)
  await OTP.create({ mobileNumber, otp });

  // Send OTP via SMS (use a service like Twilio or Nexmo)
  // Example:
  // await sendOtpToMobile(mobileNumber, otp);

  res.status(200).json({ message: "OTP sent to mobile number" });
};

const verifyOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  const validOtp = await OTP.findOne({ mobileNumber, otp });

  if (!validOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP verified, allow the user to reset the password
  res.status(200).json({ message: "OTP verified" });
};

const resetPassword = async (req, res) => {
  const { mobileNumber, newPassword } = req.body;

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password in the user collection
  await User.updateOne({ mobileNumber }, { password: hashedPassword });

  res.status(200).json({ message: 'Password reset successfully' });
};

module.exports = { requestOTP, verifyOTP ,resetPassword};
