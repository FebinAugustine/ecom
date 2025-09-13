import { useState } from 'react';

const ResetPasswordForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
        <input name="oldPassword" type="password" required value={formData.oldPassword} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
        <input name="newPassword" type="password" required value={formData.newPassword} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
