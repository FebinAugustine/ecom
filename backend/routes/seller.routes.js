import express from "express";
import passport from "passport";
import {
  registerSeller,
  loginSeller,
  logoutSeller,
  googleAuthCallback,
  refreshAccessToken,
  forgotPassword,
  forgotPsswordCodeVerificationAndResetPassword,
  resetPassword,
  updateSellerProfile,
  updateSellerAvatar,
  getCurrentSeller,
} from "../controllers/seller.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/register-seller").post(registerSeller);
router.route("/login-seller").post(loginSeller);
router.route("/seller-refresh-token").post(refreshAccessToken);
router.route("/seller-forgot-password").post(forgotPassword);
router
  .route("/seller-forgot-password-code-verification")
  .post(forgotPsswordCodeVerificationAndResetPassword);

// Secured routes
router.route("/logout-seller").post(authMiddleware, logoutSeller);
router.route("/seller-me").get(authMiddleware, getCurrentSeller);
router.route("/seller-reset-password").post(authMiddleware, resetPassword);
router.route("/update-seller-profile").put(authMiddleware, updateSellerProfile);
router
  .route("/update-seller-avatar")
  .put(authMiddleware, upload.single("avatar"), updateSellerAvatar);

export default router;
