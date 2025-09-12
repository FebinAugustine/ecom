import express from "express";
import userRoutes from "./user.routes.js";
import sellerRoutes from "./seller.routes.js";
import adminRoutes from "./admin.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

export default router;
