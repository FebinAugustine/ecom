import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import { createOrder } from '../apis/order.api.js';
import { useNotify } from '../hooks/useNotify';

const CheckoutPage = () => {
  const { user, setUser } = useAuthStore();
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  const cartItems = user?.cart || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress) {
      notifyError('Shipping address is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createOrder({ shippingAddress });
      // The backend clears the cart, so we need to update the user state
      const updatedUser = { ...user, cart: [] };
      setUser(updatedUser);
      notifySuccess('Order placed successfully!');
      navigate('/orders'); // Redirect to order history
    } catch (err) {
      notifyError(err.message || 'Failed to place order.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p>You cannot proceed to checkout with an empty cart.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Order Summary */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 lg:col-span-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order summary</h2>
          <dl className="mt-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.product._id} className="flex items-center justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">{item.product.name} (x{item.quantity})</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</dd>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900 dark:text-white">Order total</dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        {/* Shipping Information Form */}
        <section className="mt-16 lg:mt-0 lg:col-span-7">
          <form onSubmit={handlePlaceOrder}>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shipping information</h2>
            <div className="mt-4">
              <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Address</label>
              <div className="mt-1">
                <textarea
                  id="shipping-address"
                  name="shipping-address"
                  rows={3}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;
