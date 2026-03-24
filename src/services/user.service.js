const crypto = require("crypto");
const User = require("../models/user.model");
const AppError = require("../errors/AppError");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email.service");

//Auth
exports.registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 409);

  const hashedPassword = await hashPassword(password);


  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires,
  });

 
  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw new AppError("Failed to send verification email. Please try again.", 500);
  }

  user.password = undefined;
  return user;
};

exports.verifyEmail = async (token) => {
  if (!token) throw new AppError("Verification token is required", 400);


  const user = await User.findOne({ verificationToken: token })
    .select("+verificationToken +verificationTokenExpires");

  if (!user) throw new AppError("Invalid verification token", 400);

  if (user.verificationTokenExpires < Date.now()) {
    throw new AppError("Verification token has expired. Please register again.", 400);
  }


  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

 
  if (!user.isVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  user.password = undefined;
  return user;
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });


  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpires;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user, resetToken);
  } catch (err) {
  
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError("Failed to send reset email. Please try again.", 500);
  }
};

exports.resetPassword = async (token, newPassword) => {
  if (!token) throw new AppError("Reset token is required", 400);

  const user = await User.findOne({ resetPasswordToken: token })
    .select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  if (user.resetPasswordExpires < Date.now()) {
    throw new AppError("Reset token has expired. Please request a new one.", 400);
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
};



exports.getAllUsers = async () => User.find().select("-password");

exports.getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

exports.updateUser = async (id, data) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new AppError("User not found", 404);
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
};