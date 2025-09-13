import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import sellerRoutes from "./seller.routes.js";
import adminRoutes from "./admin.routes.js"; // Import admin routes

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes); // Use admin routes

export default router;
