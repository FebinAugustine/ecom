import { useState, useEffect } from 'react';
import { getAllProducts } from '../apis/product.api.js';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination'; // Import the Pagination component
import { useNotify } from '../hooks/useNotify';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { notifyError } = useNotify();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProducts({ page: currentPage, limit: 8 });
        if (response.data) {
          setProducts(response.data.docs); // The pagination library uses 'docs' for the results array
          setPagination({
            totalPages: response.data.totalPages,
            currentPage: response.data.page,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          });
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, notifyError]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Explore Our Products</h1>
      {products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
