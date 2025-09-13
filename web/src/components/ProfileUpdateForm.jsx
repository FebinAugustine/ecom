import { useState, useEffect } from 'react';

const ProfileUpdateForm = ({ user, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
  });

  // Pre-populate the form when the user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input name="username" type="text" required value={formData.username} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <input name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
