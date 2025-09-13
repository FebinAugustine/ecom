import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    createCategoryService,
    getAllCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service.js";

/**
 * @description Create a new category
 * @route POST /api/v1/categories
 * @access Private (Admin, Seller)
 */
export const createCategory = asyncHandler(async (req, res) => {
    const newCategory = await createCategoryService(req.body);
    return res.status(201).json(new ApiResponse(201, newCategory, "Category created successfully"));
});

/**
 * @description Get all categories
 * @route GET /api/v1/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategoriesService();
    return res.status(200).json(new ApiResponse(200, categories, "Categories retrieved successfully"));
});

/**
 * @description Update a category
 * @route PUT /api/v1/categories/:id
 * @access Private (Admin, Seller)
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedCategory = await updateCategoryService(id, req.body);
    return res.status(200).json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});

/**
 * @description Delete a category
 * @route DELETE /api/v1/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteCategoryService(id);
    return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});
