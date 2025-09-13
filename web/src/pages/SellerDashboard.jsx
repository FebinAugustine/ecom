import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { getSellerRevenue } from '../apis/analytics.api.js'; // Assuming you create this file

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await getSellerRevenue();
        if (response.data) {
          setRevenue(response.data.totalRevenue);
        }
      } catch (error) {
        console.error("Failed to fetch seller revenue", error);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Welcome, {user?.username}!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">This is your seller dashboard. From here, you can manage your products, view orders, and update your profile.</p>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="p-6 bg-indigo-600 dark:bg-indigo-800 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-medium">Total Revenue</h2>
          <p className="text-4xl font-bold mt-2">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link to="/dashboard/seller/products" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Products</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Add new products, update existing ones, and manage your inventory.</p>
        </Link>

        <Link to="/dashboard/seller/orders" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Orders</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View and update the status of orders containing your products.</p>
        </Link>

        <Link to="/profile" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Profile</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Update your personal and company information.</p>
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
