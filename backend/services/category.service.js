import { Category } from '../models/category.model.js';
import ApiError from '../utils/ApiErrors.js';

/**
 * Creates a new category.
 * @param {object} categoryData - The data for the new category.
 * @returns {Promise<object>} The newly created category.
 */
export const createCategoryService = async (categoryData) => {
  const { name, description } = categoryData;
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, 'A category with this name already exists.');
  }
  const newCategory = await Category.create({ name, description });
  return newCategory;
};

/**
 * Retrieves all categories.
 * @returns {Promise<Array<object>>} A list of all categories.
 */
export const getAllCategoriesService = async () => {
  const categories = await Category.find({});
  return categories;
};

/**
 * Updates an existing category.
 * @param {string} categoryId - The ID of the category to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated category.
 */
export const updateCategoryService = async (categoryId, updateData) => {
  const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

/**
 * Deletes a category.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise<object>} The deleted category.
 */
export const deleteCategoryService = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  // Note: We might need to handle products associated with this category later.
  return category;
};
