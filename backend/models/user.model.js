import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'; // Import the plugin

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Hide password by default
    },
    role: {
      type: String,
      enum: ["USER", "SELLER", "ADMIN"],
      default: "USER",
    },
    avatar: {
      type: String, // cloudinary url
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: { // New field to manage account status
      type: Boolean,
      default: true,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeExpiry: {
      type: Date,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    // User-specific fields
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    // Seller-specific fields
    companyName: {
        type: String,
    },
    gst: {
      type: String,
    },
    pan: {
      type: String,
    },
    tin: {
      type: String,
    },
    website: {
      type: String,
    },
    aadhar: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // Admin-specific fields
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.AT_SECRET,
    { expiresIn: process.env.AT_EXPIRY }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.RT_SECRET,
    { expiresIn: process.env.RT_EXPIRY }
  );
};

// Customize JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  // Remove sensitive fields
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.forgotPasswordCode;
  delete userObject.forgotPasswordCodeExpiry;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpiry;

  // Conditionally remove role-specific fields
  if (userObject.role !== 'ADMIN') {
    delete userObject.users;
  }

  if (userObject.role !== 'SELLER') {
    delete userObject.companyName;
    delete userObject.gst;
    delete userObject.pan;
    delete userObject.tin;
    delete userObject.website;
    delete userObject.aadhar;
    delete userObject.products;
  }

  return userObject;
}

// Apply the pagination plugin
userSchema.plugin(mongooseAggregatePaginate);

const User = mongoose.model("User", userSchema);

export default User;
