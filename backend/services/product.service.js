import { Product } from '../models/product.model.js';
import { uploadOnCloudinary, deleteImageFromCloudinary } from '../utils/cloudinary.fileuplaod.js';
import ApiError from '../utils/ApiErrors.js';
import mongoose from 'mongoose';

// ... (other services remain the same for now)

export const createProductService = async (productData, sellerId, files) => {
  const { name, description, price, category, stock } = productData;
  if (!files || files.length === 0) {
    throw new ApiError(400, 'At least one product image is required.');
  }
  const imageUrls = [];
  for (const file of files) {
    const result = await uploadOnCloudinary(file.path);
    if (result && result.url) {
      imageUrls.push(result.url);
    } else {
      throw new ApiError(500, 'Failed to upload one or more images.');
    }
  }
  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    seller: sellerId,
    images: imageUrls,
  });
  if (!newProduct) {
    throw new ApiError(500, 'Something went wrong while creating the product.');
  }
  return newProduct;
};

export const getAllProductsService = async (options) => {
  const aggregate = Product.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'sellerInfo'
      }
    },
    {
      $unwind: '$sellerInfo'
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    {
      $unwind: '$categoryInfo'
    },
    {
        $project: {
            'sellerInfo.password': 0,
            'sellerInfo.refreshToken': 0,
        }
    }
  ]);

  const paginatedResult = await Product.aggregatePaginate(aggregate, options);
  return paginatedResult;
};

export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId).populate([
    { path: 'seller', select: 'username companyName' },
    { path: 'reviews.user', select: 'username avatar' },
    { path: 'category', select: 'name' },
  ]);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

export const updateProductService = async (productId, sellerId, updateData, files) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  if (product.seller.toString() !== sellerId.toString()) {
    throw new ApiError(403, 'You are not authorized to update this product.');
  }
  if (files && files.length > 0) {
    for (const imageUrl of product.images) {
      try {
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        await deleteImageFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error("Old Cloudinary image deletion failed, continuing...", cloudinaryError);
      }
    }
    const newImageUrls = [];
    for (const file of files) {
      const result = await uploadOnCloudinary(file.path);
      if (result && result.url) {
        newImageUrls.push(result.url);
      } else {
        throw new ApiError(500, 'Failed to upload new images.');
      }
    }
    product.images = newImageUrls;
  }
  Object.assign(product, updateData);
  await product.save();
  return product;
};

export const deleteProductService = async (productId, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  if (product.seller.toString() !== sellerId.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this product.');
  }
  if (product.images && product.images.length > 0) {
    for (const imageUrl of product.images) {
      try {
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        await deleteImageFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary image deletion failed for one image, continuing...", cloudinaryError);
      }
    }
  }
  await Product.findByIdAndDelete(productId);
  return product;
};

export const addOrUpdateReviewService = async (productId, userId, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === userId.toString()
  );
  if (existingReviewIndex >= 0) {
    product.reviews[existingReviewIndex].rating = rating;
    product.reviews[existingReviewIndex].comment = comment;
  } else {
    product.reviews.push({ user: userId, rating, comment });
  }
  await product.save();
  return product;
};

export const updateReviewService = async (productId, reviewId, userId, updateData) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    const review = product.reviews.id(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to update this review.');
    }
    review.rating = updateData.rating || review.rating;
    review.comment = updateData.comment || review.comment;
    await product.save();
    return product;
};

export const deleteReviewService = async (productId, reviewId, userId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    const review = product.reviews.id(reviewId);
    if (!review) {
        throw new ApiError(404, 'Review not found');
    }
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this review.');
    }
    review.remove();
    await product.save();
    return product;
};

export const toggleLikeService = async (productId, userId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  const likeIndex = product.likes.indexOf(userId);
  if (likeIndex >= 0) {
    product.likes.splice(likeIndex, 1);
  } else {
    product.likes.push(userId);
  }
  await product.save();
  return product;
};

export const getProductsBySellerService = async (sellerId, options) => {
    const aggregate = Product.aggregate([
        { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
        { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryInfo' } },
        { $unwind: '$categoryInfo' },
        { $sort: { createdAt: -1 } }
    ]);

    const paginatedResult = await Product.aggregatePaginate(aggregate, options);
    return paginatedResult;
};