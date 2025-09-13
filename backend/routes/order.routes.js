import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Secured routes for a user to create an order and view their orders
router.route('/')
    .post(authMiddleware, createOrder)
    .get(authMiddleware, getMyOrders);

export default router;
