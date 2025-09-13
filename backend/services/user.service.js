import User from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiErrors.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.fileuplaod.js";

const updateUserProfileService = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Build the update object with only the fields that are present in the request
  const updateFields = {};
  if (updateData.username !== undefined) updateFields.username = updateData.username;
  if (updateData.address !== undefined) updateFields.address = updateData.address;
  if (updateData.phone !== undefined) updateFields.phone = updateData.phone;

  // If the user is a seller, add seller-specific fields to the update object
  if (user.role === 'SELLER') {
    if (updateData.companyName !== undefined) updateFields.companyName = updateData.companyName;
    if (updateData.gst !== undefined) updateFields.gst = updateData.gst;
    if (updateData.pan !== undefined) updateFields.pan = updateData.pan;
    if (updateData.aadhar !== undefined) updateFields.aadhar = updateData.aadhar;
    if (updateData.website !== undefined) updateFields.website = updateData.website;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

const updateUserAvatarService = async (user, avatarLocalPath) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  if (user.avatar) {
    try {
      const urlParts = user.avatar.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      await deleteImageFromCloudinary(publicId);
    } catch (cloudinaryError) {
      console.error("Old Cloudinary avatar deletion failed:", cloudinaryError);
    }
  }

  user.avatar = avatar.url;
  await user.save();

  return user;
};

const deleteAccountService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.avatar) {
    try {
      const urlParts = user.avatar.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        await deleteImageFromCloudinary(publicId);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary avatar deletion failed:", cloudinaryError);
    }
  }

  await User.findByIdAndDelete(userId);

  return user;
};

const toggleWishlistService = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const user = await User.findById(userId);
  const productIndex = user.wishlist.indexOf(productId);

  if (productIndex >= 0) {
    user.wishlist.splice(productIndex, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  
  const updatedUser = await User.findById(userId).populate('wishlist');
  return updatedUser;
};

const manageCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  if (quantity > product.stock) {
    throw new ApiError(400, `Not enough stock. Only ${product.stock} items available.`);
  }

  const user = await User.findById(userId);
  if (!user) {
      throw new ApiError(404, "User not found");
  }

  const cartItemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (cartItemIndex >= 0) {
    if (quantity > 0) {
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      user.cart.splice(cartItemIndex, 1);
    }
  } else {
    if (quantity > 0) {
      user.cart.push({ product: productId, quantity });
    }
  }

  await user.save();
  
  const updatedUser = await User.findById(userId).populate('cart.product');
  return updatedUser;
};

const getCartService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'cart.product',
    select: 'name price images stock',
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.cart;
};

export {
  updateUserProfileService,
  updateUserAvatarService,
  deleteAccountService,
  toggleWishlistService,
  manageCartService,
  getCartService,
};
