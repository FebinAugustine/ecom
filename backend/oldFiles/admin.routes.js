import express from "express";
import passport from "passport";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  forgotPassword,
  forgotPsswordCodeVerificationAndResetPassword,
  resetPassword,
  updateAdminProfile,
  updateAdminAvatar,
  getCurrentAdmin,
} from "./admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);
router.route("/logout-admin").post(authMiddleware, logoutAdmin);
router.route("/admin-refresh-token").post(refreshAccessToken);
router.route("/admin-forgot-password").post(forgotPassword);
router
  .route("/admin-forgot-password-code-verification")
  .post(forgotPsswordCodeVerificationAndResetPassword);

// Secured routes
router.route("/admin-logout").post(authMiddleware, logoutAdmin);
router.route("/admin-me").get(authMiddleware, getCurrentAdmin);
router.route("/admin-reset-password").post(authMiddleware, resetPassword);
router.route("/update-admin-profile").put(authMiddleware, updateAdminProfile);
router
  .route("/update-admin-avatar")
  .put(authMiddleware, upload.single("avatar"), updateAdminAvatar);

export default router;
