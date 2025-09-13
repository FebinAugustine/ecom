import { Router } from 'express';
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';
import sellerMiddleware from '../middlewares/seller.middleware.js';

const router = Router();

// Middleware to check if user is either an Admin or a Seller
const adminOrSellerMiddleware = (req, res, next) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'SELLER') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only admins or sellers can perform this action.' });
    }
};

// Public route to get all categories
router.route('/').get(getAllCategories);

// Protected routes for creating and updating categories
router.route('/').post(authMiddleware, adminOrSellerMiddleware, createCategory);
router.route('/:id').put(authMiddleware, adminOrSellerMiddleware, updateCategory);

// Strictly protected route for deleting categories
router.route('/:id').delete(authMiddleware, adminMiddleware, deleteCategory);

export default router;
