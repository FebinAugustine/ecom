import { Link } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useAuthStore from '../state/useAuthStore';
import { useNotify } from '../hooks/useNotify';
import { toggleLike } from '../apis/product.api.js';
import { manageCart } from '../apis/user.api.js';

const StarIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { user, isAuthenticated, setUser } = useAuthStore();
  const { notifySuccess, notifyError } = useNotify();
  const queryClient = useQueryClient();

  // Correctly derive liked status from the product's likes array
  const isLiked = product.likes?.includes(user?._id);

  const averageRating = product.reviews?.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;

  const { mutate: likeMutation } = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      // Invalidate the products query to refetch and show the updated like status
      queryClient.invalidateQueries({ queryKey: ['products'] });
      notifySuccess(isLiked ? 'Product unliked!' : 'Product liked!');
    },
    onError: (err) => {
      notifyError(err.message || 'Failed to update like status.');
    },
  });

  const handleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) return notifyError('You must be logged in to like a product.');
    likeMutation(product._id);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) return notifyError('You must be logged in to add items to your cart.');
    try {
      const response = await manageCart(product._id, 1);
      setUser(response.data);
      notifySuccess(`Added to cart!`);
    } catch (err) {
      notifyError(err.message || 'Failed to add to cart.');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-gray-700 sm:aspect-none sm:h-60 relative">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
        {isAuthenticated && (
          <button onClick={handleLike} className="absolute top-2 right-2 p-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm z-10">
            <svg className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{product.category?.name || 'Uncategorized'}</p>
        </div>
        <div className="flex items-center">
          <Rating rating={averageRating} />
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({product.reviews?.length || 0})</span>
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
        </div>
        {isAuthenticated && user?.role === 'USER' && (
            <button onClick={handleAddToCart} className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 z-10 relative">
                Add to Cart
            </button>
        )}
      </div>
    </Link>
  );
};

const Rating = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rating} />)}
    </div>
);

export default ProductCard;
