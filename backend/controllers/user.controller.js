import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  updateUserProfileService,
  updateUserAvatarService,
  deleteAccountService,
  toggleWishlistService,
  manageCartService,
  getCartService
} from "../services/user.service.js";
import ApiError from "../utils/ApiErrors.js";
import redis from "../config/redis.js";

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user
  const updateData = req.body; // Get the update data from the request body

  // Call the service with the correct arguments: userId and updateData
  const updatedUser = await updateUserProfileService(userId, updateData);

  // Invalidate cache
  await redis.del(`user:${userId}`);

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

const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    const updatedUser = await toggleWishlistService(userId, productId);

    // Invalidate cache
    await redis.del(`user:${userId}`);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Wishlist updated successfully"));
});

const manageCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const updatedUser = await manageCartService(userId, productId, quantity);

    // Invalidate cache
    await redis.del(`user:${userId}`);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Cart updated successfully"));
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await getCartService(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

export {
  updateProfile,
  updateUserAvatar,
  googleAuthCallback,
  deleteAccount,
  toggleWishlist,
  manageCart,
  getCart,
};
