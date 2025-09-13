import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, manageCart } from '../apis/user.api.js';
import { useNotify } from '../hooks/useNotify';
import useAuthStore from '../state/useAuthStore';

const CartPage = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { notifySuccess, notifyError } = useNotify();

  // Derive cart items directly from the global state for a single source of truth
  const cartItems = user?.cart || [];

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCart();
        if (response.data) {
          // Set the cart in the global state
          setUser({ ...user, cart: response.data });
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch cart.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
        fetchCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]); // Rerun only when the user ID changes

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const response = await manageCart(productId, newQuantity);
      // Simply update the global user state. The component will re-render with the new cart data.
      setUser(response.data);
      notifySuccess('Cart updated!');
    } catch (err) {
      notifyError(err.message || 'Failed to update cart.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    // Defensive check to ensure product exists before calculating price
    if (item.product && typeof item.product.price === 'number') {
      return acc + item.product.price * item.quantity;
    }
    return acc;
  }, 0);

  if (isLoading) {
    return <p className="text-center">Loading your cart...</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <ul role="list" className="border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                item.product && // Defensive render: only show if product data exists
                <li key={item.product._id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48" />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link to={`/products/${item.product._id}`} className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100">
                              {item.product.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item.product._id}`} className="sr-only">Quantity, {item.product.name}</label>
                        <input 
                          id={`quantity-${item.product._id}`}
                          type="number" 
                          min="1" 
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value, 10))}
                          className="w-20 rounded-md border border-gray-300 dark:border-gray-600 py-1.5 text-base leading-5 font-medium text-gray-700 dark:text-white text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
                        />
                        <div className="absolute top-0 right-0">
                          <button type="button" onClick={() => handleQuantityChange(item.product._id, 0)} className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Remove</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900 dark:text-white">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <Link to="/checkout" className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                Proceed to Checkout
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CartPage;
