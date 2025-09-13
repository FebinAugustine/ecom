import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserStatus } from '../apis/admin.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const AdminSellersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifySuccess, notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sellers', { page: currentPage, limit: 5, role: 'SELLER' }],
    queryFn: getAllUsers,
    keepPreviousData: true,
  });

  const { mutate: toggleSellerStatus } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      notifySuccess('Seller status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['sellers', { page: currentPage, limit: 5, role: 'SELLER' }] });
    },
    onError: (err) => {
      notifyError(err.message || 'Failed to update seller status.');
    },
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading sellers...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  const sellers = data?.docs || [];
  const pagination = {
    totalPages: data?.totalPages,
    currentPage: data?.page,
  };

  return (
    <div className="container mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Manage Sellers</h1>
      {sellers.length > 0 ? (
        <div>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {sellers.map((seller) => (
              <div key={seller._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-3 mb-4">
                <div className="flex items-center space-x-4">
                  <img className="h-12 w-12 rounded-full object-cover" src={seller.avatar || `https://i.pravatar.cc/150?u=${seller._id}`} alt={seller.username} />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{seller.companyName || seller.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{seller.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {seller.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <button onClick={() => toggleSellerStatus({ userId: seller._id, isActive: !seller.isActive })} className={`text-white px-3 py-1 rounded-md ${seller.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {seller.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sellers.map((seller) => (
                  <tr key={seller._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full object-cover" src={seller.avatar || `https://i.pravatar.cc/150?u=${seller._id}`} alt={seller.username} /></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{seller.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{seller.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{seller.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{seller.isActive ? 'Active' : 'Disabled'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => toggleSellerStatus({ userId: seller._id, isActive: !seller.isActive })} className={`text-white px-3 py-1 rounded-md ${seller.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>{seller.isActive ? 'Disable' : 'Enable'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center">No sellers found.</p>
      )}
      {pagination && pagination.totalPages > 1 && <Pagination {...pagination} onPageChange={handlePageChange} />}
    </div>
  );
};

export default AdminSellersPage;
