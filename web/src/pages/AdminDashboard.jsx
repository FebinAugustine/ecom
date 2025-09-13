import { Link } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Welcome, {user?.username}!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">This is the admin control panel. From here, you can manage users, products, and oversee the entire platform.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Manage Users Card */}
        <div className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Users</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View, edit, or suspend user and seller accounts.</p>
        </div>

        {/* Manage Products Card */}
        <div className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Products</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Review and manage all products listed on the platform.</p>
        </div>

        {/* Profile Card */}
        <Link to="/profile" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Profile</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Update your personal administrator information.</p>
        </Link>

        {/* Reset Password Card */}
        <Link to="/reset-password" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Password</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Change your current password to a new one.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
