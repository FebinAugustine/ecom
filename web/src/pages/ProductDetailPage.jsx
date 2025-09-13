import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addOrUpdateReview, updateReview, deleteReview } from '../apis/product.api.js';
import { useNotify } from '../hooks/useNotify';
import useAuthStore from '../state/useAuthStore';
import ReviewSection from '../components/ReviewSection';
import ReviewForm from '../components/ReviewForm';
import ActionButtons from '../components/ActionButtons';

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { notifySuccess, notifyError } = useNotify();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, notifyError]);

  const handleReviewSubmit = async (reviewData) => {
    setIsReviewLoading(true);
    try {
      const response = await addOrUpdateReview(productId, reviewData);
      if (response.data) {
        setProduct(response.data);
        notifySuccess('Review submitted successfully!');
      }
    } catch (err) {
      notifyError(err.message || 'Failed to submit review.');
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId, reviewData) => {
    try {
        const response = await updateReview(productId, reviewId, reviewData);
        if (response.data) {
            setProduct(response.data);
            notifySuccess('Review updated successfully!');
        }
    } catch (err) {
        notifyError(err.message || 'Failed to update review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
        const response = await deleteReview(productId, reviewId);
        if (response.data) {
            setProduct(response.data);
            notifySuccess('Review deleted successfully!');
        }
    } catch (err) {
        notifyError(err.message || 'Failed to delete review.');
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center">Product not found.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div>
          <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedImage === index ? 'ring-2 ring-indigo-500' : ''}`}>
                <img src={image} alt="" className="w-full h-full object-center object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{product.name}</h1>
          <div className="mt-3">
            <p className="text-3xl text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 dark:text-gray-300 space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Category: {product.category.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Stock: {product.stock}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Seller: {product.seller.companyName || product.seller.username}</p>
          </div>
          <ActionButtons product={product} />
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <ReviewSection reviews={product.reviews} onUpdateReview={handleUpdateReview} onDeleteReview={handleDeleteReview} />
        {isAuthenticated && (
          <div className="mt-8">
            <ReviewForm onSubmit={handleReviewSubmit} isLoading={isReviewLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
