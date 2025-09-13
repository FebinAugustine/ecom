import axiosInstance from './axiosInstance';

const handleApiError = (error) => {
  if (error.response) {
    return error.response.data;
  } else if (error.request) {
    return { message: 'Network Error: No response from server. Please check if the backend is running.' };
  } else {
    return { message: error.message };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/users/update-profile', profileData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserAvatar = async (formData) => {
  try {
    const response = await axiosInstance.put('/users/update-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/users/delete-account');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
