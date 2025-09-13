import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordWithCodePage from './pages/ResetPasswordWithCodePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Pages
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password-with-code" element={<ResetPasswordWithCodePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Role-Specific Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard/user" element={<UserDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
