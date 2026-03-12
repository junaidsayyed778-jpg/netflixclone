
const userModel = require("../models/userModels")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistModel");
const sendOTP = require("../utils/sendEmail");

/**
 * @name registerController
 * @description Handle user registration with OTP verification flow
 * Flow: 1) Send OTP → 2) Verify OTP → 3) Complete Registration
 */

// ───────────────────────────────────────────────────
// UTILS (Add these at top of file or in separate utils/)
// ───────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOTP = (otp) => {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// ───────────────────────────────────────────────────
// SEND OTP
// ───────────────────────────────────────────────────
async function sendOTPController(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser?.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    if (existingUser) {
      existingUser.otp = otpHash;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await userModel.create({
        email,
        otp: otpHash,
        otpExpiry,
        isVerified: false,
      });
    }

    await sendOTP(email, otp);

    // ✅ DEV ONLY - Remove in production
    if (process.env.NODE_ENV === "development") {
      console.log(`🔐 OTP for ${email}: ${otp}`);
    }

    res.status(200).json({
      message: "OTP sent successfully. Check your email.",
      email,
    });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
}

// ───────────────────────────────────────────────────
// @name registerUser - Complete registration AFTER OTP verified
// ───────────────────────────────────────────────────
async function registerUser(req, res) {
  try {
    const { username, email, password, otp } = req.body;

    // Validation
    if (!username || !email || !password || !otp) {
      return res.status(400).json({
        message: "Please provide username, email, password and OTP",
      });
    }

    // Find user and include OTP fields for verification
    const user = await userModel.findOne({ email }).select("+otp +otpExpiry +isVerified");

    if (!user) {
      return res.status(404).json({ message: "No registration found. Please send OTP first." });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified. Please login." });
    }

    // Check OTP expiration
    if (user.otpExpiry < Date.now()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Verify OTP (hash input and compare)
    const otpHash = hashOTP(otp);
    if (user.otp !== otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP verified! Now create full user account
    const hash = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hash;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate token ONLY after successful verification
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Registration failed" });
  }
}

// ───────────────────────────────────────────────────
// @name verifyOTP - Your original function (enhanced)
// ───────────────────────────────────────────────────
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    const user = await userModel.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check expiration
    if (user.otpExpiry < Date.now()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Hash and compare
    const otpHash = hashOTP(otp);
    if (user.otp !== otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified (but don't create full account yet)
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Email verified successfully. Complete your registration." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Verification failed" });
  }
}
// ───────────────────────────────────────────────────
// @name resendOTP - Bonus: Allow resending OTP
// ───────────────────────────────────────────────────
async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    const user = await userModel.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Cannot resend OTP" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otpHash;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(email, otp);
    console.log(`🔐 New OTP for ${email}: ${otp}`); // Dev only

    res.json({ message: "New OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to resend OTP" });
  }
}

/**
 * @name loginUserController
 * @description This controller will handle user login logic. It will receive user credentials from the request, validate them, and then generate a JWT token if the credentials are correct.
 */
async function loginUser(req, res) {
  const { email, username, password } = req.body;

  //validation

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if(!user){
    return res.status(400).json({
      message: "Invalid credentials"
    })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { userId: user._id },
     process.env.JWT_SECRET, 
     {expiresIn: "1d",});

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

     res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            email: user.email,
            username: user.username
        },
        token
     })
}

/**
 * 
 * @name logoutUserController
 * @description this controller will handle user logged out logic
 */
async function logoutUser(req, res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(400).json({
      message: "Token is required"
    })
  }

  await blacklistModel.create({ token });
  
 res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true, // production me true
  });

  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * @name getMeController
 * @description this controller will return the logged in user data
 */
async function getMe(req, res){

  const user = await userModel.findById(req.user.userId).select("-password");

  res.status(200).json({
    message: "User data fetched",
    user:{
      id: user._id,
      email: user.email,
      username: user.username
    }
  })
}

module.exports = {
  sendOTPController,
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  getMe
};
