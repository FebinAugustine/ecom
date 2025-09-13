# Frontend Stage Two Todo [COMPLETED]

This document provides a detailed, step-by-step checklist for implementing the Stage Two frontend features.

**Stage Two is complete.** All planned features for products, orders, user interactions, and administration have been fully implemented on the frontend.

## 1. API Layer Setup

- [x] Create `src/apis/product.api.js` for all product-related API calls.
- [x] Create `src/apis/category.api.js` for category CRUD operations.
- [x] Create `src/apis/order.api.js` for creating and viewing orders.
- [x] Create `src/apis/admin.api.js` for admin-specific actions.
- [x] Create `src/apis/analytics.api.js` for revenue data.
- [x] Update `src/apis/user.api.js` with functions for wishlist and cart management.

## 2. Public E-Commerce Pages

- [x] **Product Listing**:
    - [x] Create a reusable `ProductCard.jsx` component.
    - [x] Create a `ProductsPage.jsx` that fetches and displays all products.
    - [x] Add the `/products` route to `App.jsx` and Header.
- [x] **Product Details**:
    - [x] Create a `ProductDetailPage.jsx`.
    - [x] Implement fetching and displaying of a single product's details.
    - [x] Create a `ReviewSection.jsx` component to display existing reviews.
    - [x] Create a `ReviewForm.jsx` component to allow authenticated users to submit a review.
    - [x] Add the dynamic `/products/:id` route to `App.jsx`.

## 3. User Interaction Implementation

- [x] **Product Engagement Buttons**:
    - [x] Add "Like", "Add to Wishlist", and "Add to Cart" buttons to `ProductDetailPage.jsx`.
    - [x] Implement the API calls and state updates for these actions.
- [x] **Wishlist Page**:
    - [x] Create a `WishlistPage.jsx`.
    - [x] Fetch and display the user's wishlist items.
    - [x] Add the protected `/wishlist` route and Header link.
- [x] **Shopping Cart Page**:
    - [x] Create a `CartPage.jsx`.
    - [x] Fetch and display cart items, allowing for quantity updates and item removal.
    - [x] Display the cart subtotal and a "Proceed to Checkout" button.
    - [x] Add the protected `/cart` route and Header link.

## 4. Checkout & Order Flow

- [x] **Checkout Page**:
    - [x] Create a `CheckoutPage.jsx`.
    - [x] Implement a form for users to enter their shipping address.
    - [x] Implement the `createOrder` API call upon submission.
    - [x] Add the protected `/checkout` route.
- [x] **Order History**:
    - [x] Create an `OrderHistoryPage.jsx`.
    - [x] Fetch and display a list of the user's past orders.
    - [x] Add the protected `/orders` route.

## 5. Seller Dashboard Features

- [x] **Product Management**:
    - [x] Create a `ProductForm.jsx` component for creating/editing products.
    - [x] Create a `SellerProductsPage.jsx` for sellers to view and manage their product listings.
    - [x] Implement Create, Edit, and Delete functionality.
    - [x] Add all necessary protected routes for product management.
- [x] **Order Management**:
    - [x] Create a `SellerOrdersPage.jsx` for sellers to view orders for their products.
    - [x] Implement functionality to update order statuses.
    - [x] Add the protected `/dashboard/seller/orders` route and dashboard link.
- [x] **Analytics**:
    - [x] Update `SellerDashboard.jsx` to fetch and display the seller's total revenue.

## 6. Admin Dashboard Features

- [x] **User Management**:
    - [x] Create a `UserManagementPage.jsx` to display all users.
    - [x] Implement functionality to disable/enable user accounts.
    - [x] Add the protected `/dashboard/admin/users` route and dashboard link.
- [x] **Category Management**:
    - [x] Create a `CategoryManagementPage.jsx` for full CRUD on categories.
    - [x] Add the protected `/dashboard/admin/categories` route and dashboard link.
- [x] **Order Oversight**:
    - [x] Create an `AdminOrdersPage.jsx` to view all platform orders.
    - [x] Add the protected `/dashboard/admin/orders` route and dashboard link.
- [x] **Analytics**:
    - [x] Update `AdminDashboard.jsx` to fetch and display total platform revenue.
