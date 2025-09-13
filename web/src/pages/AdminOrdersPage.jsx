import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../apis/order.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const AdminOrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifyError } = useNotify();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allOrders', { page: currentPage, limit: 10 }],
    queryFn: getAllOrders,
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading all orders...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  const orders = data?.docs || [];
  const pagination = {
    totalPages: data?.totalPages,
    currentPage: data?.page,
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Platform Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center">There are no orders on the platform yet.</p>
      ) : (
        <>
          <div>
            {/* Mobile Card View */}
            <div className="md:hidden">
              {orders.map(order => (
                <div key={order._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Order ID:</span>
                    <span className="text-gray-600 dark:text-gray-400">{order._id.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Customer:</span>
                    <span>{order.user?.username || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Total:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold">Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order._id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order.user?.username || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {pagination && pagination.totalPages > 1 && <Pagination {...pagination} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
