import { Router } from 'express';
import { getAllUsers, updateUserStatus } from '../controllers/admin.controller.js';
import { getAllOrders } from '../controllers/order.controller.js';
import { getPlatformRevenue } from '../controllers/analytics.controller.js'; // Import from analytics controller
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = Router();

// User management routes
router.route('/users').get(authMiddleware, adminMiddleware, getAllUsers);
router.route('/users/:id/status').put(authMiddleware, adminMiddleware, updateUserStatus);

// Order management route
router.route('/orders').get(authMiddleware, adminMiddleware, getAllOrders);

// Analytics route
router.route('/revenue').get(authMiddleware, adminMiddleware, getPlatformRevenue);

export default router;
