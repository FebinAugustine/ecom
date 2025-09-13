import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../apis/order.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const OrderHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifyError } = useNotify();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myOrders', { page: currentPage, limit: 5 }],
    queryFn: getMyOrders,
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading your order history...</p>;
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
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Placed</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-medium text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {order.productDetails.map(item => (
                    <div key={item._id} className="flex items-center py-2">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && <Pagination {...pagination} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
