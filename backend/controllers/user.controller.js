import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  updateUserProfileService,
  updateUserAvatarService,
  deleteAccountService,
} from "../services/user.service.js";
import ApiError from "../utils/ApiErrors.js";
import redis from "../config/redis.js";

const updateProfile = asyncHandler(async (req, res) => {
  const { username, address, phone } = req.body;

  const user = req.user;

  const updatedUser = await updateUserProfileService(user, {
    username,
    address,
    phone,
  });

  // Invalidate cache
  await redis.del(`user:${user._id}`);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const user = await updateUserAvatarService(req.user, avatarLocalPath);

  // Invalidate cache
  await redis.del(`user:${req.user._id}`);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const googleAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = { httpOnly: true, secure: true };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("http://localhost:5173");
});

const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await deleteAccountService(userId);

    // Invalidate cache
    await redis.del(`user:${userId}`);

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
  updateProfile,
  updateUserAvatar,
  googleAuthCallback,
  deleteAccount,
};
