import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  registerService,
  loginService,
  logoutService,
  refreshTokensCheck,
  sendForgotPasswordEmail,
  verifyEmailService,
  verifyForgotPasswordCodeAndResetPassword,
  resetPasswordService,
} from "../services/auth.service.js";
import ApiError from "../utils/ApiErrors.js";
import redis from "../config/redis.js";

// Generic registration controller
const register = (role) => asyncHandler(async (req, res) => {
  const newUser = await registerService(req.body, role);
  return res
    .status(201)
    .json(new ApiResponse(201, { user: newUser }, "User registered successfully"));
});

// Role-specific registration controllers
const registerUser = register("USER");
const registerSeller = register("SELLER");
const registerAdmin = register("ADMIN");

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginService(req);

  const options = { httpOnly: true, secure: true };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  await logoutService(req);

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token is missing");
  }

  const { accessToken, newRefreshToken } = await refreshTokensCheck(
    incomingRefreshToken
  );

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

  await sendForgotPasswordEmail(email);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  await verifyEmailService(token);
  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const forgotPasswordCodeVerification = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    throw new ApiError(400, "Email, code, and new password are required");
  }

  const user = await verifyForgotPasswordCodeAndResetPassword(
    email,
    code,
    newPassword
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Password reset successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  await resetPasswordService(req);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(404, "User not found");
    }

    const cachedUser = await redis.get(`user:${userId}`);

    if (cachedUser) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cachedUser), "User fetched successfully (from cache)"));
    }

    const user = req.user;
    // Corrected syntax for setting expiration with @upstash/redis
    await redis.set(`user:${userId}`, JSON.stringify(user), { ex: 3600 }); // Cache for 1 hour

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});


export {
  registerUser,
  registerSeller,
  registerAdmin,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  verifyEmail,
  forgotPasswordCodeVerification,
  resetPassword,
  getCurrentUser,
};
