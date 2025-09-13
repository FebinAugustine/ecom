import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerOrders, updateOrderStatus } from '../apis/order.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const SellerOrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifySuccess, notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sellerOrders', { page: currentPage, limit: 5 }], // Updated limit to 5
    queryFn: getSellerOrders,
    keepPreviousData: true,
  });

  const { mutate: changeOrderStatus } = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, { status }),
    onSuccess: () => {
      notifySuccess('Order status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['sellerOrders'] });
    },
    onError: (err) => {
      notifyError(err.message || 'Failed to update order status.');
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    changeOrderStatus({ orderId, status: newStatus });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading orders...</p>;
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
      <h1 className="text-3xl font-bold text-center mb-8">Your Customer Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        <>
          <div className="space-y-4">
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
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Status:</span>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-1"
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
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
                      <td className="px-6 py-4 text-sm">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-1"
                        >
                          <option>Pending</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
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

export default SellerOrdersPage;
