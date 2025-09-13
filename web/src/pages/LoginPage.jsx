import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { loginUser } from '../apis/auth.api.js';
import useAuthStore from '../state/useAuthStore';
import { useNotify } from '../hooks/useNotify';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore();
  const { notifySuccess, notifyError } = useNotify();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      if (response.data && response.data.user) {
        const user = response.data.user;
        notifySuccess('Login successful! Welcome back.');
        loginToStore(user);

        // THE FIX: Role-based redirect
        switch (user.role) {
          case 'ADMIN':
            navigate('/dashboard/admin');
            break;
          case 'SELLER':
            navigate('/dashboard/seller');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        throw new Error('Login failed: Invalid response from server.');
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign in to your account</h1>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
