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

// --- Product CRUD --- //

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/products');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProduct = async (productId, updateData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, updateData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// --- User Interactions --- //

export const addOrUpdateReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateReview = async (productId, reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteReview = async (productId, reviewId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleLike = async (productId) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/like`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
