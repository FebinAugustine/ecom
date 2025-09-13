import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { getPlatformRevenue } from '../apis/analytics.api.js';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await getPlatformRevenue();
        if (response.data) {
          setRevenue(response.data.totalRevenue);
        }
      } catch (error) {
        console.error("Failed to fetch platform revenue", error);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Welcome, {user?.username}!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">This is the admin control panel. From here, you can manage users, categories, orders, and oversee the entire platform.</p>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="p-6 bg-indigo-600 dark:bg-indigo-800 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-medium">Total Platform Revenue</h2>
          <p className="text-4xl font-bold mt-2">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link to="/admin/sellers" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Sellers</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View and manage all seller accounts.</p>
        </Link>

        <Link to="/admin/users" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Users</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View and manage all regular user accounts.</p>
        </Link>

        <Link to="/admin/categories" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Categories</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Create, edit, and delete product categories.</p>
        </Link>

        <Link to="/admin/orders" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Orders</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View all orders placed on the platform.</p>
        </Link>

        <Link to="/admin/profile" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Profile</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Update your personal administrator information.</p>
        </Link>

        <Link to="/admin/reset-password" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Password</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Change your current password.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
