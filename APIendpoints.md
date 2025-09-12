Creating all the API endpoints now is a smart move. A complete API endpoint list is a critical deliverable for a production-ready PRD. It will serve as a contract between the frontend, mobile, and backend development teams, ensuring everyone is on the same page.

Here is a comprehensive list of all the API endpoints for your Ecom project, organized by module and user role.

---

### **1. Public Endpoints (No Authentication Required)**

| Method | Endpoint                             | Description                                                                    |
| :----- | :----------------------------------- | :----------------------------------------------------------------------------- |
| `POST` | `/api/v1/auth/register-user`         | Registers a new customer.                                                      |
| `POST` | `/api/v1/auth/register-seller`       | Registers a new seller (account starts in a `pending-approval` state).         |
| `POST` | `/api/v1/auth/login`                 | Logs in a user, seller, or admin and returns a JWT.                            |
| `GET`  | `/api/v1/auth/verify-email/:token`   | Verifies a customer's email address.                                           |
| `POST` | `/api/v1/auth/forgot-password`       | Initiates a password reset.                                                    |
| `PUT`  | `/api/v1/auth/reset-password/:token` | Resets the password using a valid token.                                       |
| `GET`  | `/api/v1/products`                   | Fetches a list of all products with optional filters, sorting, and pagination. |
| `GET`  | `/api/v1/products/:id`               | Fetches a single product's details.                                            |
| `GET`  | `/api/v1/products/:id/reviews`       | Fetches all reviews for a specific product.                                    |
| `GET`  | `/api/v1/categories`                 | Fetches a list of all product categories.                                      |

---

### **2. Customer Endpoints (Role: `customer`)**

| Method   | Endpoint                          | Description                                |
| :------- | :-------------------------------- | :----------------------------------------- |
| `GET`    | `/api/v1/users/me`                | Fetches the logged-in user's profile.      |
| `PUT`    | `/api/v1/users/me`                | Updates the logged-in user's profile.      |
| `POST`   | `/api/v1/cart`                    | Adds an item to the user's cart.           |
| `GET`    | `/api/v1/cart`                    | Fetches the user's cart content.           |
| `PUT`    | `/api/v1/cart`                    | Updates item quantities in the cart.       |
| `DELETE` | `/api/v1/cart/:productId`         | Removes an item from the cart.             |
| `POST`   | `/api/v1/wishlist`                | Adds an item to the user's wishlist.       |
| `GET`    | `/api/v1/wishlist`                | Fetches the user's wishlist.               |
| `DELETE` | `/api/v1/wishlist/:productId`     | Removes an item from the wishlist.         |
| `GET`    | `/api/v1/orders`                  | Fetches all of the user's past orders.     |
| `GET`    | `/api/v1/orders/:id`              | Fetches a specific order's details.        |
| `POST`   | `/api/v1/orders/initiate-payment` | Initiates the payment process (Razorpay).  |
| `POST`   | `/api/v1/products/:id/reviews`    | Submits a review and rating for a product. |
| `PUT`    | `/api/v1/reviews/:id`             | Updates an existing review.                |
| `DELETE` | `/api/v1/reviews/:id`             | Deletes a review.                          |

---

### **3. Seller Endpoints (Role: `seller`)**

| Method   | Endpoint                            | Description                                                               |
| :------- | :---------------------------------- | :------------------------------------------------------------------------ |
| `GET`    | `/api/v1/sellers/dashboard`         | Fetches seller-specific analytics (sales, revenue, orders).               |
| `GET`    | `/api/v1/sellers/products`          | Fetches all products owned by the logged-in seller.                       |
| `POST`   | `/api/v1/sellers/products`          | Creates a new product.                                                    |
| `PUT`    | `/api/v1/sellers/products/:id`      | Updates a product's details.                                              |
| `DELETE` | `/api/v1/sellers/products/:id`      | Deletes a product.                                                        |
| `GET`    | `/api/v1/sellers/orders`            | Fetches all orders received by the seller.                                |
| `PUT`    | `/api/v1/sellers/orders/:id/status` | Updates the status of a specific order (e.g., to "shipped," "delivered"). |
| `GET`    | `/api/v1/sellers/invoices`          | Fetches a list of all invoices.                                           |

---

### **4. Admin Endpoints (Role: `admin`)**

| Method   | Endpoint                            | Description                                                    |
| :------- | :---------------------------------- | :------------------------------------------------------------- |
| `GET`    | `/api/v1/admin/dashboard`           | Fetches high-level analytics (total sales, user/seller count). |
| `GET`    | `/api/v1/admin/users`               | Fetches a list of all users.                                   |
| `GET`    | `/api/v1/admin/sellers`             | Fetches a list of all sellers.                                 |
| `PUT`    | `/api/v1/admin/sellers/:id/approve` | Approves a pending seller account.                             |
| `DELETE` | `/api/v1/admin/users/:id`           | Deletes a user account.                                        |
| `DELETE` | `/api/v1/admin/sellers/:id`         | Deletes a seller account.                                      |
| `GET`    | `/api/v1/admin/orders`              | Fetches a list of all orders on the platform.                  |
| `GET`    | `/api/v1/admin/products`            | Fetches a list of all products.                                |
| `DELETE` | `/api/v1/admin/products/:id`        | Deletes a product.                                             |
| `POST`   | `/api/v1/admin/payments/payout`     | Initiates a payout to a seller.                                |

---

### **5. Webhook Endpoints (Internal)**

| Method | Endpoint                   | Description                                                                                      |
| :----- | :------------------------- | :----------------------------------------------------------------------------------------------- |
| `POST` | `/api/v1/razorpay/webhook` | Receives and validates payment status updates from Razorpay. **This is crucial for production.** |

---

### **6. Notification Endpoints (Internal)**

| Method | Endpoint                | Description                                                      |
| :----- | :---------------------- | :--------------------------------------------------------------- |
| `POST` | `/api/v1/notifications` | Sends a notification (e.g., email, push notification) to a user. |

---

### **7. Google OAuth Endpoints (Internal)**

| Method | Endpoint                       | Description                        |
| :----- | :----------------------------- | :--------------------------------- |
| `GET`  | `/api/v1/auth/google/callback` | Handles the Google OAuth callback. |

---
