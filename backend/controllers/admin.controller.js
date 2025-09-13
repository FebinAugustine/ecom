import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getAllUsersService, updateUserStatusService } from "../services/admin.service.js";
import ApiError from "../utils/ApiErrors.js";

/**
 * @description Get all users, with optional role filtering and pagination
 * @route GET /api/v1/admin/users
 * @access Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const role = req.query.role;

    const options = { page, limit };
    const filter = {};
    if (role) {
        filter.role = role.toUpperCase();
    }

    const users = await getAllUsersService(options, filter);
    
    return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

/**
 * @description Update a user's active status
 * @route PUT /api/v1/admin/users/:id/status
 * @access Private (Admin)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        throw new ApiError(400, "The 'isActive' field must be a boolean.");
    }

    const updatedUser = await updateUserStatusService(id, isActive);

    return res.status(200).json(new ApiResponse(200, updatedUser, "User status updated successfully"));
});
