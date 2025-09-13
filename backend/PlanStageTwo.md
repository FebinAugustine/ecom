# Backend Stage Two Plan [IN PROGRESS]

This document outlines the features and API structure for the second stage of backend development.

## 1. Data Models

- **Category Model**:
  - `name`: String, required, unique
  - `description`: String

- **Product Model**:
  - `name`, `description`, `price`, `stock`
  - `category`: **Reference to the Category Model** (ObjectId)
  - `images`: Array of Cloudinary image URLs
  - `seller`: Reference to the User (SELLER) who owns the product
  - `reviews`: Array of embedded Review documents
  - `likes`: Array of references to Users who liked the product

- **Order Model**:
  - `user`: Reference to the User (USER) who placed the order
  - `products`: Array of objects containing product reference, quantity, and price
  - `totalAmount`, `shippingAddress`, `status` (e.g., 'Pending', 'Shipped', 'Delivered')

- **Review Schema** (to be embedded in Product):
  - `user`: Reference to the User who wrote the review
  - `rating` (1-5), `comment`, `createdAt`

- **User Model Updates**:
  - `wishlist`: Array of references to Products
  - `cart`: Array of objects containing product reference and quantity

## 2. API Endpoints

### Category Management
- `POST /api/v1/categories` - **Create Category** (ADMIN, SELLER)
- `GET /api/v1/categories` - **Get All Categories** (Public)
- `PUT /api/v1/categories/:id` - **Update Category** (ADMIN, SELLER)
- `DELETE /api/v1/categories/:id` - **Delete Category** (ADMIN)

### Product Management
- `POST /api/v1/products` - **Create Product** (SELLER)
- `GET /api/v1/products` - **Get All Products** (Public)
- `GET /api/v1/products/:id` - **Get Single Product** (Public)
- `PUT /api/v1/products/:id` - **Update Product** (SELLER, owner only)
- `DELETE /api/v1/products/:id` - **Delete Product** (SELLER, owner only)

### User Interactions
- `POST /api/v1/products/:id/reviews` - **Add/Update Review** (USER)
- `POST /api/v1/products/:id/like` - **Toggle Like** on a product (USER)
- `POST /api/v1/users/wishlist` - **Add/Remove from Wishlist** (USER)
- `POST /api/v1/users/cart` - **Add/Remove from Cart** (USER)
- `GET /api/v1/users/cart` - **View Cart** (USER)

### Order Management
- `POST /api/v1/orders` - **Create Order** from cart (USER)
- `GET /api/v1/orders` - **Get My Orders** (USER)
- `GET /api/v1/seller/orders` - **Get Orders for My Products** (SELLER)
- `PUT /api/v1/seller/orders/:id` - **Update Order Status** (SELLER)

### Admin Management
- `GET /api/v1/admin/users` - **Get All Users/Sellers** (ADMIN)
- `PUT /api/v1/admin/users/:id/status` - **Disable/Enable User Account** (ADMIN)
- `GET /api/v1/admin/orders` - **Get All Orders** (ADMIN)

### Analytics
- `GET /api/v1/seller/revenue` - **Get My Total Revenue** (SELLER)
- `GET /api/v1/admin/revenue` - **Get Platform Total Revenue** (ADMIN)

## 3. Authentication

- **Google OAuth**: Already implemented for user login.

# Stage Two End
