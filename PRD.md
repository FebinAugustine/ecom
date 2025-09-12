# Project Ecom PRD

An ecommerce platform with multiple user roles, like the one you're building, requires a well-structured approach to planning. First, you'll need a solid list of database entities (models) to represent the core data. Following that, a Product Requirements Document (PRD) will outline the specific features and functionalities for each part of the application (backend, web, and mobile).

### **1. List of Entities/Models**

Based on your project description, here are the essential entities you'll need for your backend (MongoDB) database:

- **User**: This model will represent customers.
  - **Fields**: `_id`, `googleId` (optional, unique for Google OAuth), `name`, `email` (unique), `password`, `phone` (unique), `address` (sub-document or reference), `role` (`customer`), `cart` (array of objects), `wishlist` (array of references to `Product`), `purchaseHistory` (array of references to `Order`), `verificationCode`, `codeValidUntil`, `invoices` (array of references to `Invoice`), `profileImage` (URL), `createdAt`, `updatedAt`.
- **Seller**: This model represents the sellers on your platform.
  - **Fields**: `_id`, `name`, `email` (unique), `password`, `storeName` (unique), `address`, `phone` (unique), `bankDetails` (sub-document), `gstNumber` (unique), `role` (`seller`), `products` (array of references to `Product`), `orders` (array of references to `Order`), `invoices` (array of references to `Invoice`), `profileImage` (URL), `salesRevenue` (number), `verificationStatus` (`pending`, `approved`, `rejected`), `createdAt`, `updatedAt`.
- **Admin**: This model represents the administrative users.

  - **Fields**: `_id`, `name`, `email` (unique), `password`, `role` (`admin`), `createdAt`, `updatedAt`.

- **Product**: This is the core model for all items sold on the platform.
  - **Fields**: `_id`, `name`, `description`, `price`, `images` (array of URLs), `seller` (reference to `Seller`), `category` (string or reference to `Category`), `stockQuantity`, `reviews` (array of sub-documents or references), `createdAt`, `updatedAt`.
- **Order**: This model tracks every transaction.
  - **Fields**: `_id`, `user` (reference to `User`), `products` (array of objects with `productId`, `quantity`, `price`), `seller` (reference to `Seller`), `totalAmount`, `status` (`pending`, `shipped`, `delivered`, `cancelled`), `paymentStatus` (`pending`, `paid`), `paymentId` (from Razorpay), `shippingAddress`, `invoice` (reference to `Invoice`), `createdAt`, `updatedAt`.
- **Invoice**: This model stores details of an invoice for an order.
  - **Fields**: `_id`, `order` (reference to `Order`), `invoiceNumber`, `issueDate`, `billingAddress`, `totalAmount`, `createdAt`, `updatedAt`.
- **Review/Comment**: This model stores user feedback on products.
  - **Fields**: `_id`, `user` (reference to `User`), `product` (reference to `Product`), `rating` (number), `comment`, `likes` (array of user references), `createdAt`, `updatedAt`.
- **Category**: A simple model to categorize products.
  - **Fields**: `_id`, `name` (unique), `description`.

---

### **2. Product Requirements Document (PRD)**

### **Backend PRD**

- **Project Name**: Ecom Backend REST API
- **Objective**: To build a robust and scalable REST API using Node.js, Express, and MongoDB that serves as the central hub for the Ecom web and mobile applications.
- **Core Functionalities**:
  - **Authentication & Authorization**:
    - Implement **JWT-based authentication with Access and refresh Tokens http-only cookies** for all protected routes.
    - Create separate login and registration endpoints for `User`, `Seller`, and `Admin`.
    - Develop middleware to handle role-based access control.
  - **User/Customer Management**:
    - Endpoints for user registration, login, profile management (read/update).
    - APIs for managing shopping cart, wishlist, and purchase history.
  - **Seller Management**:
    - Endpoints for seller registration, login, profile management.
    - APIs for CRUD operations on products, including image uploads to Cloudinary.
    - APIs to view and update order status.
    - Endpoints for managing payment details.
  - **Product Management**:
    - APIs for creating, reading, updating, and deleting products.
    - Implement search, filtering, and sorting functionalities for products.
    - APIs for product reviews and likes.
  - **Order & Payment Processing**:
    - Endpoints to create a new order.
    - APIs to handle Razorpay payment gateway integration, including webhooks for payment status updates.
    - Endpoints for generating and retrieving invoices.
  - **Admin Dashboard APIs**:
    - Endpoints to fetch summary data (total sales, user count, seller count).
    - APIs for CRUD operations on `User`, `Seller`, and `Product`.
    - Endpoints to manage payments and view all orders.
- **Technology Stack**:
  - **Language**: JavaScript
  - **Framework**: Node.js, Express.js
  - **Database**: MongoDB
  - **Database Tool**: Mongoose ODM
  - **Image Storage**: Cloudinary
  - **Session/Caching**: Redis (Upstash)
- **APIs & Endpoints**:
  - Define a clear API endpoint structure (e.g., `/api/v1/users`, `/api/v1/sellers/products`).
  - All API responses should be in JSON format with clear status codes.

---

### **Web Frontend PRD**

- **Project Name**: Ecom Web Application
- **Objective**: To build a professional, responsive, and user-friendly web application for customers and sellers to interact with the platform.
- **Core Features**:
  - **Public Routes**:
    - **Home Page**:
      - Featured products, popular sellers, categories.
      - Promotional banners.
      - Links to all public pages.
    - **Product Listing**: Page to browse and search for products with filters and sorting.
    - **Product Detail Page**: Detailed view of a single product with images, description, price, seller info, and reviews.
    - **Static Pages**: Contact, Privacy Policy, Terms & Conditions, Return Policy.
  - **User/Customer Dashboard**:
    - **Profile Page**: View and edit user details.
    - **My Cart**: Page to view, update, and checkout cart items.
    - **Wishlist**: Page to manage saved products.
    - **My Purchases**: List of all orders with status tracking and invoice downloads.
  - **Seller Dashboard**:
    - **Overview**: Dashboard with key metrics like total sales, orders, and revenue.
    - **Product Management**: CRUD interface to manage products with an image upload feature.
    - **Order Management**: View and update the status of incoming orders.
    - **Invoices**: View, generate, and manage invoices.
- **Technology Stack**:
  - **Framework**: React.js
  - **Styling**: Tailwind CSS
  - **State Management**: Zustand
  - **API Calls**: Axios or Tanstack Query
  - **Payment Integration**: Razorpay's React-specific SDK.
- **Performance & Design**:
  - The application should be **fully responsive** and work on all screen sizes.
  - Follow a clean and modern design aesthetic consistent with the brand.

---

### **Mobile Frontend PRD**

- **Project Name**: Ecom Mobile Application
- **Objective**: To create a native-like mobile experience for both iOS and Android platforms, providing core functionalities for customers and sellers.
- **Core Features**:
  - **Public Routes**:
    - **Home Screen**:
      - Similar to the web version, optimized for a small screen.
    - **Product Listing & Search**: Intuitive mobile-first product browsing.
    - **Product Detail Screen**: Clear layout for product details, images, and reviews.
  - **User/Customer Dashboard**:
    - **Profile**: Access and edit user profile.
    - **Shopping Cart**: Smooth and easy-to-use checkout flow.
    - **My Orders**: Simple list of past orders with status icons.
    - **Wishlist**: Manage wishlisted products.
  - **Seller Dashboard**:
    - **Dashboard**: Mobile-optimized charts and metrics for sales and orders.
    - **Product Management**: Simplified interface for CRUD operations on products, including camera/gallery access for image uploads.
    - **Order Management**: Push notifications for new orders, quick status updates.
- **Technology Stack**:
  - **Framework**: React Native
  - **Styling**: Nativewind (for Tailwind CSS-like experience)
  - **State Management**: Zustand
  - **API Calls**: Axios or Tanstack Query
  - **Payment Integration**: Razorpay's React Native SDK.
- **Performance & User Experience**:
  - The app must be **performant** and have fast loading times.
  - Use native UI components for a seamless experience.
  - Implement **push notifications** for order updates, new messages, etc.
