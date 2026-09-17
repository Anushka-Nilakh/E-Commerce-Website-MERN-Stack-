const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    const otp = generateOtp();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await Otp.deleteMany({ mobile });

    await Otp.create({
      mobile,
      otp,
      expiresAt,
    });

    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      message: "OTP generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        message: "Mobile number and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({
      mobile,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile number and new password are required",
      });
    }

    // Check whether OTP was verified
    const verifiedOtp = await Otp.findOne({
      mobile,
      verified: true,
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    // Find user
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Remove verified OTP
    await Otp.deleteOne({
      _id: verifiedOtp._id,
    });

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

const sendForgotOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    // Check whether account exists
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this mobile number",
      });
    }

    const otp = generateOtp();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Remove previous OTP
    await Otp.deleteMany({ mobile });

    // Create new OTP
    await Otp.create({
      mobile,
      otp,
      expiresAt,
      verified: false,
    });

    console.log(`Forgot Password OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      message: "OTP generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};
const registerUser = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({
        message: "Name, mobile number and password are required",
      });
    }

    const verifiedOtp = await Otp.findOne({
      mobile,
      verified: true,
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Please verify your mobile number with OTP first",
      });
    }

    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      mobile,
      password: hashedPassword,
    });

    await Otp.deleteOne({
      _id: verifiedOtp._id,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check required fields
    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile number and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    // Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateOtp,
  sendOtp,
  verifyOtp,
  resetPassword,
  sendForgotOtp,
};