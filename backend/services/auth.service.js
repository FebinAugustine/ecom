import User from "../models/user.model.js";
import ApiError from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/mail.js";

const registerService = async (body, role) => {
  const { username, email, password } = body;

  // Find if user already exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  // Base user data
  const userData = {
    username,
    email,
    password,
    role,
  };

  // If the role is SELLER, add seller-specific fields
  if (role === "SELLER") {
    const { companyName, gst, pan, tin, website, aadhar } = body;
    if (!companyName) {
      throw new ApiError(400, "Company name is required for sellers.");
    }
    userData.companyName = companyName;
    userData.gst = gst;
    userData.pan = pan;
    userData.tin = tin;
    userData.website = website;
    userData.aadhar = aadhar;
  }

  // Generate verification token for USER and SELLER roles
  if (role === "USER" || role === "SELLER") {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    userData.emailVerificationToken = verificationToken;
    userData.emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }

  const newUser = await User.create(userData);

  if (!newUser) {
    throw new ApiError(400, "Something went wrong while registering user");
  }

  // If user or seller, send verification email
  if (newUser.role === "USER" || newUser.role === "SELLER") {
    const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${newUser.emailVerificationToken}`;
    const message = `<h1>Email Verification</h1><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a><p>This link will expire in 10 minutes.</p>`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Verify Your Email Address",
        html: message,
      });
    } catch (error) {
      console.error("Verification email sending failed:", error);
    }
  }

  return newUser;
};

const loginService = async (req) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // Enforce email verification for users and sellers
  if ((user.role === 'USER' || user.role === 'SELLER') && !user.isEmailVerified) {
    throw new ApiError(401, "Must verify to login");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  } else {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { user, accessToken, refreshToken };
  }
};

const logoutService = async (req) => {
  const user = req.user;
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  return user;
};

const refreshTokensCheck = async (incomingRefreshToken) => {
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.RT_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("+refreshToken");

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

const sendForgotPasswordEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  const forgotPasswordCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.forgotPasswordCode = code;
  user.forgotPasswordCodeExpiry = forgotPasswordCodeExpiry;
  await user.save({validateBeforeSave: false});

  const message = `<h1>Password Reset Code</h1><p>Your password reset code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid for 10 min)",
      html: message,
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    user.forgotPasswordCode = undefined;
    user.forgotPasswordCodeExpiry = undefined;
    await user.save({validateBeforeSave: false});
    throw new ApiError(500, "There was an error sending the email. Please try again later.");
  }
};

const verifyEmailService = async (token) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return user;
};

const verifyForgotPasswordCodeAndResetPassword = async (
  email,
  code,
  password
) => {
  const user = await User.findOne({ email }).select("+forgotPasswordCode +forgotPasswordCodeExpiry");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.forgotPasswordCode !== code.toString()) {
    throw new ApiError(400, "Invalid code");
  }

  if (user.forgotPasswordCodeExpiry < Date.now()) {
    throw new ApiError(400, "Code has expired");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  } else if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  } else if (password.length > 20) {
    throw new ApiError(400, "Password must be less than 20 characters");
  }
  user.password = password;
  user.forgotPasswordCode = undefined;
  user.forgotPasswordCodeExpiry = undefined;
  await user.save();
  return user;
};

const resetPasswordService = async (req) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save();
  return user;
};

export {
  registerService,
  loginService,
  logoutService,
  refreshTokensCheck,
  sendForgotPasswordEmail,
  verifyEmailService,
  verifyForgotPasswordCodeAndResetPassword,
  resetPasswordService,
};
