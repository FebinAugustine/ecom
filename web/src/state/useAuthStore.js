import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Will hold user data object
      isAuthenticated: false,

      // Action to set user on login
      login: (userData) => set({ user: userData, isAuthenticated: true }),

      // Action to clear user on logout
      logout: () => set({ user: null, isAuthenticated: false }),

      // Action to update user data (e.g., after profile update)
      setUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
