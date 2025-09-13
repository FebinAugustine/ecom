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

// --- User Order Management --- //

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMyOrders = async ({ queryKey }) => {
  const [_key, { page, limit }] = queryKey;
  try {
    const response = await axiosInstance.get(`/orders?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// --- Seller Order Management --- //

export const getSellerOrders = async ({ queryKey }) => {
  const [_key, { page, limit }] = queryKey;
  try {
    const response = await axiosInstance.get(`/seller/orders?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axiosInstance.put(`/seller/orders/${orderId}`, statusData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// --- Admin Order Management --- //

export const getAllOrders = async ({ queryKey }) => {
  const [_key, { page, limit }] = queryKey;
  try {
    const response = await axiosInstance.get(`/admin/orders?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
