import { useState, useEffect } from 'react';
import useAuthStore from '../state/useAuthStore';
import { useNotify } from '../hooks/useNotify';
import { toggleLike } from '../apis/product.api.js';
import { toggleWishlist, manageCart } from '../apis/user.api.js';

const ActionButtons = ({ product }) => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const { notifySuccess, notifyError } = useNotify();

  // Immediately return null if the user is not a regular USER
  if (!isAuthenticated || user?.role !== 'USER') {
    return null;
  }

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (user && product) {
      // Ensure arrays exist before checking
      setIsLiked(product.likes?.includes(user._id) || false);
      setIsInWishlist(user.wishlist?.some(item => (typeof item === 'object' ? item._id : item) === product._id) || false);
    }
  }, [user, product]);

  const handleLike = async () => {
    try {
      await toggleLike(product._id);
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      notifySuccess(newIsLiked ? 'Product liked!' : 'Product unliked!');
    } catch (err) {
      notifyError(err.message || 'Failed to update like status.');
    }
  };

  const handleWishlist = async () => {
    try {
      const response = await toggleWishlist(product._id);
      setUser(response.data);
      const newIsInWishlist = !isInWishlist;
      setIsInWishlist(newIsInWishlist);
      notifySuccess(newIsInWishlist ? 'Added to wishlist!' : 'Removed from wishlist!');
    } catch (err) {
      notifyError(err.message || 'Failed to update wishlist.');
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await manageCart(product._id, quantity);
      setUser(response.data);
      notifySuccess(`Added ${quantity} to cart!`);
    } catch (err) {
      notifyError(err.message || 'Failed to add to cart.');
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2">-</button>
          <input type="number" value={quantity} readOnly className="w-12 text-center bg-transparent" />
          <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2">+</button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700"
        >
          Add to bag
        </button>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <button onClick={handleLike} className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md ${isLiked ? 'bg-red-100 dark:bg-red-900 border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
          {isLiked ? '♥ Liked' : '♡ Like'}
        </button>
        <button onClick={handleWishlist} className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md ${isInWishlist ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
          {isInWishlist ? '★ In Wishlist' : '☆ Add to Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
