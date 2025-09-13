import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * A custom hook to display toast notifications with stable functions.
 */
export const useNotify = () => {
  /**
   * Displays a success toast notification.
   * @param {string} message - The message to display.
   */
  const notifySuccess = useCallback((message) => {
    toast.success(message, {
      style: {
        background: '#4B5563', // gray-700
        color: '#F9FAFB',    // gray-50
      },
    });
  }, []);

  /**
   * Displays an error toast notification.
   * @param {string} message - The message to display.
   */
  const notifyError = useCallback((message) => {
    toast.error(message, {
      style: {
        background: '#4B5563', // gray-700
        color: '#F9FAFB',    // gray-50
      },
    });
  }, []);

  return { notifySuccess, notifyError };
};
