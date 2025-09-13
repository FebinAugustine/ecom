import useAuthStore from '../state/useAuthStore';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { user } = useAuthStore();

  // Defensively filter the wishlist to ensure all items are valid objects with an _id.
  // This prevents crashes if the array contains invalid data (e.g., plain strings).
  const wishlistItems = user?.wishlist?.filter(item => typeof item === 'object' && item !== null && item._id) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
