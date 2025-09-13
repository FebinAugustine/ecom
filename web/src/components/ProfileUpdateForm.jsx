import { useState, useEffect } from 'react';

const ProfileUpdateForm = ({ user, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
    // Seller-specific fields
    companyName: '',
    gst: '',
    pan: '',
    aadhar: '',
  });

  // Pre-populate the form when the user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || '',
        companyName: user.companyName || '',
        gst: user.gst || '',
        pan: user.pan || '',
        aadhar: user.aadhar || '',
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
      {/* Common Fields */}
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

      {/* Seller-only Fields */}
      {user.role === 'SELLER' && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GST Number</label>
            <input name="gst" type="text" value={formData.gst} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PAN Number</label>
            <input name="pan" type="text" value={formData.pan} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aadhar Number</label>
            <input name="aadhar" type="text" value={formData.aadhar} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
          </div>
        </>
      )}

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
