import { Router } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById,
    updateProduct,
    deleteProduct,
    addOrUpdateReview,
    toggleLike,
    updateReview,
    deleteReview
} from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import sellerMiddleware from '../middlewares/seller.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Product routes
router.route('/')
    .get(getAllProducts)
    .post(
        authMiddleware,
        sellerMiddleware,
        upload.array('images', 5),
        createProduct
    );

router.route('/:id')
    .get(getProductById)
    .put(
        authMiddleware,
        sellerMiddleware,
        upload.array('images', 5), // Add multer middleware for image updates
        updateProduct
    )
    .delete(
        authMiddleware,
        sellerMiddleware,
        deleteProduct
    );

// Review and Like routes
router.route('/:id/reviews').post(authMiddleware, addOrUpdateReview);
router.route('/:id/like').post(authMiddleware, toggleLike);

// Specific review management routes
router.route('/:productId/reviews/:reviewId')
    .put(authMiddleware, updateReview)
    .delete(authMiddleware, deleteReview);

export default router;
