import express from "express";
import passport from "passport";
import {
  updateProfile,
  updateUserAvatar,
  googleAuthCallback,
  deleteAccount,
  toggleWishlist,
  manageCart,
  getCart,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secured routes
router.route("/update-profile").put(authMiddleware, updateProfile);
router
  .route("/update-avatar")
  .put(authMiddleware, upload.single("avatar"), updateUserAvatar);
router.route("/delete-account").delete(authMiddleware, deleteAccount);
router.route("/wishlist").post(authMiddleware, toggleWishlist);

// Secured routes for cart management
router.route("/cart")
    .get(authMiddleware, getCart)
    .post(authMiddleware, manageCart);

// Google OAuth routes
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), googleAuthCallback);

export default router;
