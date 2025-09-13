import { useState } from 'react';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [role, setRole] = useState('USER'); // 'USER' or 'SELLER'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      {/* Role Selection */}
      <div className="flex justify-center space-x-4 mb-6">
        <button type="button" onClick={() => setRole('USER')} className={`px-4 py-2 rounded-md ${role === 'USER' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>Register as User</button>
        <button type="button" onClick={() => setRole('SELLER')} className={`px-4 py-2 rounded-md ${role === 'SELLER' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>Register as Seller</button>
      </div>

      {/* Common Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input name="username" type="text" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input name="email" type="email" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input name="password" type="password" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>

      {/* Seller-only Fields */}
      {role === 'SELLER' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
          <input name="companyName" type="text" required={role === 'SELLER'} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
      )}

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          {isLoading ? 'Registering...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
