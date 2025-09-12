import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuthCallback,
  getCurrentUser,
  refreshAccessToken,
  forgotPassword,
  forgotPsswordCodeVerificationAndResetPassword,
  resetPassword,
  updateProfile,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router
  .route("/forgot-password-code-verification")
  .post(forgotPsswordCodeVerificationAndResetPassword);

// Secured routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/me").get(authMiddleware, getCurrentUser);
router.route("/reset-password").post(authMiddleware, resetPassword);
router.route("/update-profile").put(authMiddleware, updateProfile);
router
  .route("/update-avatar")
  .put(authMiddleware, upload.single("avatar"), updateUserAvatar);

// Google OAuth routes
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), googleAuthCallback);

export default router;
