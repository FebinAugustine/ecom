import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { 
    createProductService, 
    getAllProductsService, 
    getProductByIdService,
    updateProductService,
    deleteProductService,
    addOrUpdateReviewService,
    toggleLikeService,
    updateReviewService,
    deleteReviewService,
    getProductsBySellerService // Import new service
} from "../services/product.service.js";

// ... (other controllers remain the same)

export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  const sellerId = req.user._id;
  const files = req.files;
  const newProduct = await createProductService(productData, sellerId, files);
  return res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const options = { page, limit };

  const products = await getAllProductsService(options);
  
  return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"));
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    return res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const sellerId = req.user._id;
    const files = req.files;
    const updatedProduct = await updateProductService(id, sellerId, updateData, files);
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user._id;
    await deleteProductService(id, sellerId);
    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export const addOrUpdateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const updatedProduct = await addOrUpdateReviewService(id, userId, rating, comment);
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Review added/updated successfully"));
});

export const toggleLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const updatedProduct = await toggleLikeService(id, userId);
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Like toggled successfully"));
});

export const updateReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;
    const updatedProduct = await updateReviewService(productId, reviewId, userId, updateData);
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Review updated successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const userId = req.user._id;
    const updatedProduct = await deleteReviewService(productId, reviewId, userId);
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Review deleted successfully"));
});

/**
 * @description Get all products for the logged-in seller
 * @route GET /api/v1/seller/products
 * @access Private (Seller)
 */
export const getProductsBySeller = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    const products = await getProductsBySellerService(sellerId, options);

    return res.status(200).json(new ApiResponse(200, products, "Seller products retrieved successfully"));
});
