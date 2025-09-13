import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import SellerLayout from './layouts/SellerLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useLoginCheck } from './hooks/useLoginCheck';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordWithCodePage from './pages/ResetPasswordWithCodePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SellerProductsPage from './pages/SellerProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminSellersPage from './pages/AdminSellersPage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  useLoginCheck();

  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password-with-code" element={<ResetPasswordWithCodePage />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
          <Route element={<SellerLayout />}>
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/products/new" element={<CreateProductPage />} />
            <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/profile" element={<ProfilePage />} />
            <Route path="/seller/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* User and Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            {/* User Routes */}
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/reset-password" element={<ResetPasswordPage />} />

            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/admin/sellers" element={<AdminSellersPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
