import Seller from "../models/seller.model.js";
import ApiError from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.fileuplaod.js";
import jwt from "jsonwebtoken";

const registerSellerService = async (req) => {
  const { username, email, password } = req.body;

  // Find if user already exists
  const user = await Seller.findOne({ email });
  if (user) {
    throw new ApiError(400, "User already exists");
  }
  // find if username already exists
  const usernameExists = await Seller.findOne({ username });
  if (usernameExists) {
    throw new ApiError(400, "Username already exists");
  }

  const newUser = await Seller.create({ username, email, password });
  if (!newUser) {
    throw new ApiError(400, "Something went wrong while registering user");
  }

  // return user without password
  newUser.password = undefined;

  return newUser;
};

const loginSellerService = async (req) => {
  const { email, password } = req.body;

  const user = await Seller.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.password !== password) {
    throw new ApiError(400, "Invalid password");
  } else {
    // generate Access and Refresh token and save refresh token in the db and return user, access token and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { user, accessToken, refreshToken };
  }
};

const logoutSellerService = async (req) => {
  const user = req.user;
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  return user;
};

const refreshTokensCheck = async (incomingRefreshToken) => {
  try {
    // 1. Verify the incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.RT_SECRET // Assuming RT_SECRET is the refresh token secret
    );

    // 2. Find the user based on the decoded token's ID
    const user = await Seller.findById(decodedToken?._id);

    // 3. Validate the user and the refresh token
    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // 4. Generate a new pair of access and refresh tokens
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // 5. Update the user's refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false }); // Avoids running pre-save hooks unnecessarily

    // 6. Return the new tokens
    return { accessToken, newRefreshToken };
  } catch (error) {
    // Re-throw as an ApiError for consistent error handling in the controller
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

const sendForgotPasswordEmail = async (email) => {
  const user = await User.findOne({ email });

  // If there is a user with this email the create a random 6 digit code and send the mail to the user using nodemailer
  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000);
    user.forgotPasswordCode = code;
    await user.save();
    // set a validity to the code
    const forgotPasswordCodeExpiry = new Date();
    forgotPasswordCodeExpiry.setMinutes(
      forgotPasswordCodeExpiry.getMinutes() + 10 // 10 minutes
    );
    user.forgotPasswordCodeExpiry = forgotPasswordCodeExpiry;
    await user.save();

    return code;
  } else {
    throw new ApiError(404, "User not found");
  }
};

const verifyForgotPasswordCodeAndResetPassword = async (
  email,
  code,
  password
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.resetPasswordCode === code) {
    throw new ApiError(400, "Invalid code");
  }
  if (
    !user.forgotPasswordCodeExpiry ||
    user.forgotPasswordCodeExpiry > Date.now()
  ) {
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

  const user = req.user;
  if (user.password !== oldPassword) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save();
  return user;
};

const updateSellerProfileService = async (
  user,
  { username, address, phone, gst, pan, tin, website, aadhar }
) => {
  // A simple object to map the input parameters to the user's schema fields.
  const fieldsToUpdate = {
    username,
    address,
    phone,
    gst,
    pan,
    tin,
    website,
    aadhar,
  };

  // Iterate over the provided fields and update the user object
  // only if the field is not null or undefined AND the data has changed.
  Object.keys(fieldsToUpdate).forEach((key) => {
    const newValue = fieldsToUpdate[key];
    const oldValue = user[key];

    if (newValue !== undefined && newValue !== null && newValue !== oldValue) {
      user[key] = newValue;
    }
  });

  // Save the user object. Mongoose will intelligently only save the fields that have been modified.
  await user.save();

  return user;
};

const updateSellerAvatarService = async (user, avatarLocalPath) => {
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while while uploading avatar");
  }

  const updatedUser = await Seller.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return updatedUser;
};

export {
  registerSellerService,
  loginSellerService,
  logoutSellerService,
  refreshTokensCheck,
  sendForgotPasswordEmail,
  verifyForgotPasswordCodeAndResetPassword,
  resetPasswordService,
  updateSellerProfileService,
  updateSellerAvatarService,
};
