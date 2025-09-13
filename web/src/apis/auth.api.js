import axiosInstance from './axiosInstance';

const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    return { message: 'Network Error: No response from server. Please check if the backend is running.' };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { message: error.message };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (data) => {
  const { role, ...credentials } = data;
  const endpoint = role === 'SELLER' ? '/auth/register/seller' : '/auth/register/user';

  try {
    const response = await axiosInstance.post(endpoint, credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPasswordWithCode = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password-code-verification', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
