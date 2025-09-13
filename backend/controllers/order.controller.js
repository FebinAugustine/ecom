import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { 
    createOrderService, 
    getMyOrdersService,
    getOrdersForSellerService,
    updateOrderStatusService,
    getAllOrdersService
} from "../services/order.service.js";
import ApiError from "../utils/ApiErrors.js";

// ... (other controllers remain the same)

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;
    const userId = req.user._id;
    if (!shippingAddress) {
        throw new ApiError(400, "Shipping address is required");
    }
    const newOrder = await createOrderService(userId, shippingAddress);
    return res.status(201).json(new ApiResponse(201, newOrder, "Order created successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };
    const orders = await getMyOrdersService(userId, options);
    return res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

export const getOrdersForSeller = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    const orders = await getOrdersForSellerService(sellerId, options);

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Seller orders retrieved successfully"));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id;
    if (!status) {
        throw new ApiError(400, "New status is required");
    }
    const updatedOrder = await updateOrderStatusService(id, sellerId, status);
    return res.status(200).json(new ApiResponse(200, updatedOrder, "Order status updated successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    const orders = await getAllOrdersService(options);
    
    return res.status(200).json(new ApiResponse(200, orders, "All orders retrieved successfully"));
});
