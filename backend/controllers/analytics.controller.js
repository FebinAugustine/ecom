import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getSellerRevenueService, getPlatformRevenueService } from "../services/analytics.service.js";

/**
 * @description Get the total revenue for the logged-in seller
 * @route GET /api/v1/seller/revenue
 * @access Private (Seller)
 */
export const getSellerRevenue = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    const totalRevenue = await getSellerRevenueService(sellerId);

    return res.status(200).json(new ApiResponse(200, { totalRevenue }, "Seller revenue retrieved successfully"));
});

/**
 * @description Get the total revenue for the entire platform
 * @route GET /api/v1/admin/revenue
 * @access Private (Admin)
 */
export const getPlatformRevenue = asyncHandler(async (req, res) => {
    const totalRevenue = await getPlatformRevenueService();

    return res.status(200).json(new ApiResponse(200, { totalRevenue }, "Platform revenue retrieved successfully"));
});
