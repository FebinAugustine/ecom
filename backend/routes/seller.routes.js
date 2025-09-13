import { Router } from 'express';
import { getOrdersForSeller, updateOrderStatus } from '../controllers/order.controller.js';
import { getProductsBySeller } from '../controllers/product.controller.js'; // Import from product controller
import { getSellerRevenue } from '../controllers/analytics.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import sellerMiddleware from '../middlewares/seller.middleware.js';

const router = Router();

// Order management routes
router.route('/orders').get(authMiddleware, sellerMiddleware, getOrdersForSeller);
router.route('/orders/:id').put(authMiddleware, sellerMiddleware, updateOrderStatus);

// Product management routes
router.route('/products').get(authMiddleware, sellerMiddleware, getProductsBySeller);

// Analytics routes
router.route('/revenue').get(authMiddleware, sellerMiddleware, getSellerRevenue);

export default router;
