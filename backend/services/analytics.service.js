import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import ApiError from '../utils/ApiErrors.js';

/**
 * Calculates the total revenue for a specific seller.
 * @param {string} sellerId - The ID of the seller.
 * @returns {Promise<number>} The total revenue.
 */
export const getSellerRevenueService = async (sellerId) => {
  // 1. Find all products belonging to the seller
  const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
  if (sellerProducts.length === 0) {
    return 0; // If the seller has no products, revenue is 0
  }
  const sellerProductIds = sellerProducts.map(p => p._id.toString());

  // 2. Find all completed orders that contain any of the seller's products
  const orders = await Order.find({
    'products.product': { $in: sellerProductIds },
    status: 'Delivered',
  });

  // 3. Calculate the total revenue from those orders
  let totalRevenue = 0;
  orders.forEach(order => {
    order.products.forEach(item => {
      // If the product in the order belongs to the seller, add its value to the total
      if (sellerProductIds.includes(item.product.toString())) {
        totalRevenue += item.quantity * item.price;
      }
    });
  });

  return totalRevenue;
};

/**
 * Calculates the total revenue for the entire platform.
 * @returns {Promise<number>} The total platform revenue.
 */
export const getPlatformRevenueService = async () => {
  const deliveredOrders = await Order.find({ status: 'Delivered' });

  const totalRevenue = deliveredOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  return totalRevenue;
};
