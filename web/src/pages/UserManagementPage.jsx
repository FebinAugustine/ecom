import { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../apis/admin.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const UserTable = ({ users, onStatusToggle }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map((user) => (
          <tr key={user._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img className="h-10 w-10 rounded-full object-cover" src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.username} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.isActive ? 'Active' : 'Disabled'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onClick={() => onStatusToggle(user._id, user.isActive)} className={`text-white px-3 py-1 rounded-md ${user.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {user.isActive ? 'Disable' : 'Enable'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserManagementPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { notifySuccess, notifyError } = useNotify();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers({ page: currentPage, limit: 10 });
        if (response.data) {
          setAllUsers(response.data.docs);
          setPagination({
            totalPages: response.data.totalPages,
            currentPage: response.data.page,
          });
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch users.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, notifyError]);

  useEffect(() => {
    setSellers(allUsers.filter(user => user.role === 'SELLER'));
    setRegularUsers(allUsers.filter(user => user.role === 'USER'));
  }, [allUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, { isActive: !currentStatus });
      setAllUsers(allUsers.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      notifySuccess('User status updated successfully!');
    } catch (err) {
      notifyError(err.message || 'Failed to update user status.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading users...</p>;
  }

  return (
    <div className="container mx-auto px-4 space-y-12">
      <h1 className="text-3xl font-bold text-center">User Management</h1>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Sellers</h2>
        {sellers.length > 0 ? (
            <UserTable users={sellers} onStatusToggle={handleStatusToggle} />
        ) : (
            <p>No sellers found on this page.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Regular Users</h2>
        {regularUsers.length > 0 ? (
            <UserTable users={regularUsers} onStatusToggle={handleStatusToggle} />
        ) : (
            <p>No regular users found on this page.</p>
        )}
      </div>

      {pagination && <Pagination {...pagination} onPageChange={handlePageChange} />}
    </div>
  );
};

export default UserManagementPage;
