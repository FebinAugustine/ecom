import { useState } from 'react';

const DeleteAccount = ({ onConfirm, isLoading }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleInitialClick = () => {
    setIsConfirming(true);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-300 dark:border-red-500 mt-8">
      <h3 className="text-lg font-medium leading-6 text-red-900 dark:text-red-400">Delete Account</h3>
      <div className="mt-2 text-sm text-red-700 dark:text-red-500">
        <p>Once you delete your account, there is no going back. Please be certain.</p>
      </div>
      
      {!isConfirming ? (
        <div className="mt-4">
          <button 
            onClick={handleInitialClick} 
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            Delete Your Account
          </button>
        </div>
      ) : (
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            disabled={isLoading}
            onClick={handleConfirm} 
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Confirm Deletion'}
          </button>
          <button 
            type="button" 
            onClick={handleCancel} 
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
