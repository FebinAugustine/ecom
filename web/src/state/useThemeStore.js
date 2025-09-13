import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light', 'dark', or 'system'

      // Action to set the theme and apply it to the DOM
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        get().applyTheme();
      },

      // Action to apply the current theme to the DOM
      applyTheme: () => {
        const currentTheme = get().theme;
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (currentTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(currentTheme);
        }
      },
    }),
    {
      name: 'theme-storage', // name of the item in localStorage
      onRehydrateStorage: () => (state) => {
        // Apply the theme on initial load after rehydrating from storage
        state.applyTheme();
      },
    }
  )
);

// Apply the theme on initial load (for the first time the app is opened)
useThemeStore.getState().applyTheme();

export default useThemeStore;
