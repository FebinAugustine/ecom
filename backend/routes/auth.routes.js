import express from "express";
import {
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
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Public routes with rate limiting
router.route("/register/user").post(authLimiter, registerUser);
router.route("/register/seller").post(authLimiter, registerSeller);

// Protected admin registration route
router.route("/register/admin").post(authLimiter, authMiddleware, adminMiddleware, registerAdmin);

router.route("/login").post(authLimiter, login);
router.route("/forgot-password").post(authLimiter, forgotPassword);
router.route("/forgot-password-code-verification").post(authLimiter, forgotPasswordCodeVerification);

// Public routes without specific rate limiting (will use global limiter)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:token").get(verifyEmail);

// Secured routes
router.route("/logout").post(authMiddleware, logout);
router.route("/reset-password").post(authMiddleware, resetPassword);
router.route("/me").get(authMiddleware, getCurrentUser);

export default router;
