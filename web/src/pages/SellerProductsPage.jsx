import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerProducts } from '../apis/seller.api.js';
import { deleteProduct } from '../apis/product.api.js';
import { useNotify } from '../hooks/useNotify';
import Pagination from '../components/Pagination';

const SellerProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifySuccess, notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sellerProducts', { page: currentPage, limit: 5 }], // Updated limit to 5
    queryFn: getSellerProducts,
    keepPreviousData: true,
  });

  const { mutate: removeProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      notifySuccess('Product deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    },
    onError: (err) => {
      notifyError(err.message || 'Failed to delete product.');
    },
  });

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      removeProduct(productId);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading your products...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  const products = data?.docs || [];
  const pagination = {
    totalPages: data?.totalPages,
    currentPage: data?.page,
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <Link to="/dashboard/seller/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          + Create New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {products.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-3 mb-4">
                <div className="flex items-center space-x-4">
                  <img className="h-16 w-16 rounded-md object-cover" src={product.images[0]} alt={product.name} />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-4 text-sm font-medium">
                  <Link to={`/dashboard/seller/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dashboard/seller/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</Link>
                      <button onClick={() => handleDelete(product._id)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && <Pagination {...pagination} onPageChange={handlePageChange} />}
        </div>
      ) : (
        <p className="text-center">You have not created any products yet.</p>
      )}
    </div>
  );
};

export default SellerProductsPage;
