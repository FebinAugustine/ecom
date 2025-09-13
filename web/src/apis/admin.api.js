import axiosInstance from './axiosInstance';

// This function is now more generic and throws the error for useQuery to handle.
export const getAllUsers = async ({ queryKey }) => {
  const [_key, { page, limit, role }] = queryKey;
  
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (role) {
    params.append('role', role);
  }

  try {
    const response = await axiosInstance.get(`/admin/users?${params.toString()}`);
    return response.data.data; // Return the actual data object
  } catch (error) {
    // Let TanStack Query handle the error object
    throw error.response.data || new Error('Something went wrong');
  }
};

export const updateUserStatus = async ({ userId, isActive }) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Something went wrong');
  }
};

export const getPlatformRevenue = async () => {
  try {
    const response = await axiosInstance.get('/admin/revenue');
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Something went wrong');
  }
};
