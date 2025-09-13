import { useEffect } from 'react';
import useAuthStore from '../state/useAuthStore';
import { getCurrentUser } from '../apis/user.api.js'; // We will create this function

export const useLoginCheck = () => {
  const { user, login, logout } = useAuthStore();

  useEffect(() => {
    // Only run this check if there is no user in the state
    if (!user) {
      const checkUserStatus = async () => {
        try {
          const response = await getCurrentUser();
          if (response.data) {
            login(response.data); // Log the user in
          }
        } catch (error) {
          // If this fails, it likely means no valid cookies were found.
          // We can safely ignore the error and keep the user logged out.
          logout();
        }
      };

      checkUserStatus();
    }
  }, [user, login, logout]);
};
