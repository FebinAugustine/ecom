import axiosInstance from './axiosInstance';

const handleApiError = (error) => {
  if (error.response) {
    return error.response.data;
  } else if (error.request) {
    return { message: 'Network Error: No response from server.' };
  } else {
    return { message: error.message };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCategory = async (categoryId, updateData) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}`, updateData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
