import { Order } from '../models/order.model.js';
import User from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import ApiError from '../utils/ApiErrors.js';
import mongoose from 'mongoose';

// ... (createOrderService, getMyOrdersService, updateOrderStatusService remain the same)

export const createOrderService = async (userId, shippingAddress) => {
  const user = await User.findById(userId).populate('cart.product');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.cart.length === 0) {
    throw new ApiError(400, 'Cannot create an order with an empty cart.');
  }
  let totalAmount = 0;
  const orderProducts = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (cartItem.quantity > product.stock) {
        throw new ApiError(400, `Not enough stock for ${product.name}. Only ${product.stock} available.`);
      }
      totalAmount += cartItem.quantity * product.price;
      orderProducts.push({ product: product._id, quantity: cartItem.quantity, price: product.price });
    }
    const newOrder = new Order({ user: userId, products: orderProducts, totalAmount, shippingAddress, status: 'Pending' });
    await newOrder.save({ session });
    for (const item of user.cart) {
      await Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } }, { session });
    }
    user.cart = [];
    await user.save({ session });
    await session.commitTransaction();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getMyOrdersService = async (userId, options) => {
    const aggregate = Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $lookup: { from: 'products', localField: 'products.product', foreignField: '_id', as: 'productDetails' } },
        { $sort: { createdAt: -1 } }
    ]);
    const paginatedResult = await Order.aggregatePaginate(aggregate, options);
    return paginatedResult;
};

export const getOrdersForSellerService = async (sellerId, options) => {
  const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
  const sellerProductIds = sellerProducts.map(p => p._id);

  const aggregate = Order.aggregate([
    { $match: { 'products.product': { $in: sellerProductIds } } },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, // THE FIX
    { $sort: { createdAt: -1 } }
  ]);

  const paginatedResult = await Order.aggregatePaginate(aggregate, options);
  return paginatedResult;
};

export const updateOrderStatusService = async (orderId, sellerId, newStatus) => {
  const order = await Order.findById(orderId).populate({ path: 'products.product', populate: { path: 'seller', model: 'User' } });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  const isSellerInOrder = order.products.some(
    (item) => item.product.seller._id.toString() === sellerId.toString()
  );
  if (!isSellerInOrder) {
    throw new ApiError(403, 'You are not authorized to update this order.');
  }
  order.status = newStatus;
  await order.save();
  return order;
};

export const getAllOrdersService = async (options) => {
    const aggregate = Order.aggregate([
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, // THE FIX
        { $sort: { createdAt: -1 } }
    ]);
    const paginatedResult = await Order.aggregatePaginate(aggregate, options);
    return paginatedResult;
};
