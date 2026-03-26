
const userService = require("../services/user.service");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../config/cloudinary");
const AppError = require("../errors/AppError"); 

exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Registration successful. Please check your email to verify your account.",
      data: { user },
    });
  } catch (error) { next(error); }
};

// GET /verify-email?token=abc123
exports.verifyEmail = async (req, res, next) => {
  try {
    await userService.verifyEmail(req.query.token);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const user = await userService.loginUser(req.body.email, req.body.password);
    const token = generateToken(user);
    res.status(200).json({ success: true, statusCode: 200, token, data: { user } });
  } catch (error) { next(error); }
};

// POST /forgot-password — { email }
exports.forgotPassword = async (req, res, next) => {
  try {
    await userService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "If this email is registered, a password reset link has been sent.",
    });
  } catch (error) { next(error); }
};

// POST /reset-password?token=... — { password }
exports.resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.query.token, req.body.password);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, statusCode: 200, results: users.length, data: { users } });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, statusCode: 200, data: { user } });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
   
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      throw new AppError("Not authorized", 403);
    }

  
    if (req.body.password) {
      throw new AppError("Password cannot be updated from this route. Use /change-password.", 400);
    }

    const allowedFields = ["name", "dateOfBirth", "gender", "state", "city"];
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredData[field] = req.body[field];
      }
    });

    const user = await userService.updateUser(req.params.id, filteredData);
    res.status(200).json({ success: true, statusCode: 200, data: { user } });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, statusCode: 200, message: "User deleted successfully" });
  } catch (error) { next(error); }
};


exports.uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    // 👉 Pehle user data lao (old image ke liye)
    const existingUser = await userService.getUserById(req.user.id);
   // 👉 Agar old image hai to delete karo
    if (existingUser.profilePicPublicId) {
      await cloudinary.uploader.destroy(existingUser.profilePicPublicId);
    }
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer); 
      });

    const result = await uploadToCloudinary();


    const user = await userService.updateUser(req.user.id, {
      profilePic: result.secure_url,
      profilePicPublicId: result.public_id,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile picture uploaded successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};