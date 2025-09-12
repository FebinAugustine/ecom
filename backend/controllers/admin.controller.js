import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validationResult, loginValidator } from "../utils/validator.js";
import {
  registerAdminService,
  loginAdminService,
  logoutAdminService,
  refreshTokensCheck,
  sendForgotPasswordEmail,
  verifyForgotPasswordCodeAndResetPassword,
  resetPasswordService,
  updateAdminProfileService,
  updateAdminAvatarService,
} from "../services/admin.service.js";
import jwt from "jsonwebtoken";

const registerAdmin = asyncHandler(async (req, res) => {
  // validator for username, emailand password using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = await registerAdminService(req);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: newUser }, "User registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const loginErrors = loginValidator(req);
  if (loginErrors.length > 0) {
    return res.status(400).json({ errors: loginErrors });
  }

  const { user, accessToken, refreshToken } = await loginAdminService(req);

  // save to cookies and res user and access token
  const options = { httpOnly: true, secure: true };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const logoutUser = await logoutAdminService(req);

  if (!logoutUser) {
    throw new ApiError(404, "User not found");
  }

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(404, "User not found");
  }
  console.log(req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Extract the incoming refresh token from cookies or body
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  // 2. Validate that the token exists. If not, throw a client-side error.
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token is missing");
  }

  // 3. Call the business logic from the service layer to get new tokens
  // The service handles all verification, database queries, and token generation.
  const { accessToken, newRefreshToken } = await refreshTokensCheck(
    incomingRefreshToken
  );

  // 4. Set the new tokens in cookies and send the response
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const existingUser = await sendForgotPasswordEmail(email);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent successfully"));
});

const forgotPsswordCodeVerificationAndResetPassword = asyncHandler(
  async (req, res) => {
    const { email, code, newPassword } = req.body;

    if ((!email || !code, !newPassword)) {
      throw new ApiError(400, "Email and code are required");
    }

    const user = await verifyForgotPasswordCodeAndResetPassword(
      email,
      code,
      newPassword
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "Password reset code verified"));
  }
);

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const resetPassword = await resetPasswordService(req);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const updateAdminProfile = asyncHandler(async (req, res) => {
  const { username, address, phone } = req.body;

  const user = req.user;

  if (!username || !address || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const saveUser = await updateAdminProfileService(user, {
    username,
    address,
    phone,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, saveUser, "Profile updated successfully"));
});

const updateAdminAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing");
  }

  const user = await updateAdminAvatarService(req.user, avatarLocalPath);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  forgotPassword,
  forgotPsswordCodeVerificationAndResetPassword,
  resetPassword,
  updateAdminProfile,
  updateAdminAvatar,
  getCurrentAdmin,
};
