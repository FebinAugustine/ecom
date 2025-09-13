import { Link } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';

const UserDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Welcome, {user?.username}!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">This is your personal dashboard. From here, you can manage your profile and view your activity.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* THE FIX: Updated link to be role-specific */}
        <Link to="/user/profile" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Profile</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Update your personal information, address, and profile picture.</p>
        </Link>

        {/* THE FIX: Updated link to be role-specific */}
        <Link to="/user/reset-password" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Password</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Change your current password to a new one.</p>
        </Link>

        <Link to="/orders" className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Order History</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">View your past orders and track current shipments.</p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
