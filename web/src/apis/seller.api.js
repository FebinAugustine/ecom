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

export const getSellerProducts = async ({ queryKey }) => {
    const [_key, { page, limit }] = queryKey;
    
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    try {
        const response = await axiosInstance.get(`/seller/products?${params.toString()}`);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};