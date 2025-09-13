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

// --- Seller Analytics --- //

export const getSellerRevenue = async () => {
  try {
    const response = await axiosInstance.get('/seller/revenue');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// --- Admin Analytics --- //

export const getPlatformRevenue = async () => {
  try {
    const response = await axiosInstance.get('/admin/revenue');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
