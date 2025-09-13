# Backend Stage Two Todo [COMPLETED]

This document tracks the development progress for the second stage of the backend.

**Stage Two is complete.** All planned features for products, orders, user interactions, and administration have been fully implemented.

## 1. Database Schema & Models

- [x] Create `product.model.js`
- [x] Create `order.model.js`
- [x] Update `user.model.js` to include `wishlist` and `cart` arrays.
- [x] Create `category.model.js` with `name` and `description` fields.
- [x] Update `product.model.js` to use a `ref` to the `Category` model.

## 2. Category Management (Admin & Seller)

- [x] Implement `POST /api/v1/categories` - Create Category
- [x] Implement `GET /api/v1/categories` - Get All Categories
- [x] Implement `PUT /api/v1/categories/:id` - Update Category
- [x] Implement `DELETE /api/v1/categories/:id` - Delete Category

## 3. Product Management (Seller & Public)

- [x] **Product CRUD** (Seller Role):
    - [x] Implement `POST /api/v1/products` - Create Product
    - [x] Implement `PUT /api/v1/products/:id` - Update Product
    - [x] Implement `DELETE /api/v1/products/:id` - Delete Product
- [x] **Public Product Access**:
    - [x] Implement `GET /api/v1/products` - Get All Products
    - [x] Implement `GET /api/v1/products/:id` - Get Single Product

## 4. User Interactions (User Role)

- [x] **Reviews & Likes**:
    - [x] Implement `POST /api/v1/products/:id/reviews` - Add/Update a review for a product.
    - [x] Implement `POST /api/v1/products/:id/like` - Toggle a like on a product.
- [x] **Wishlist & Cart**:
    - [x] Implement `POST /api/v1/users/wishlist` - Add/Remove a product from the user's wishlist.
    - [x] Implement `POST /api/v1/users/cart` - Add/Remove a product from the user's cart.
    - [x] Implement `GET /api/v1/users/cart` - View the contents of the user's cart.

## 5. Order Management (User & Seller)

- [x] Implement `POST /api/v1/orders` - Create a new order from the user's cart.
- [x] Implement `GET /api/v1/orders` - Allow a user to view their own order history.
- [x] Implement `GET /api/v1/seller/orders` - Allow a seller to view orders for their products.
- [x] Implement `PUT /api/v1/seller/orders/:id` - Allow a seller to update the status of an order.

## 6. Admin & Analytics

- [x] **Admin Oversight**:
    - [x] Implement `GET /api/v1/admin/users` - Get a list of all users and sellers.
    - [x] Implement `PUT /api/v1/admin/users/:id/status` - Enable or disable a user/seller account.
    - [x] Implement `GET /api/v1/admin/orders` - Get a list of all orders on the platform.
- [x] **Revenue Analytics**:
    - [x] Implement `GET /api/v1/seller/revenue` - Calculate and return total revenue for a seller.
    - [x] Implement `GET /api/v1/admin/revenue` - Calculate and return total platform revenue.
