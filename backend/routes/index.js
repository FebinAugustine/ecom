import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// TODO: Add back product, category, and order routes when they are ready to be implemented
// router.use("/products", productRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/orders", orderRoutes);

export default router;
