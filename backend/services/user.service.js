import User from "../models/user.model.js";
import ApiError from "../utils/ApiErrors.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.fileuplaod.js";

const updateUserProfileService = async (user, { username, address, phone }) => {
  const fieldsToUpdate = { username, address, phone };

  Object.keys(fieldsToUpdate).forEach((key) => {
    const newValue = fieldsToUpdate[key];
    if (newValue !== undefined && newValue !== null) {
      user[key] = newValue;
    }
  });

  await user.save();
  return user;
};

const updateUserAvatarService = async (user, avatarLocalPath) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  // If user already has an avatar, delete the old one
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
  // 1. Find the user first, don't delete yet
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2. If user has an avatar, delete it from Cloudinary
  if (user.avatar) {
    try {
      // Extract public_id from the URL
      const urlParts = user.avatar.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        await deleteImageFromCloudinary(publicId);
      }
    } catch (cloudinaryError) {
      // Log the error but don't block user deletion
      console.error("Cloudinary avatar deletion failed:", cloudinaryError);
    }
  }

  // 3. Now, delete the user from the database
  await User.findByIdAndDelete(userId);

  return user;
};

export {
  updateUserProfileService,
  updateUserAvatarService,
  deleteAccountService,
};
