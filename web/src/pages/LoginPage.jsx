import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
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
        notifySuccess('Login successful! Welcome back.');
        loginToStore(response.data.user);
        navigate('/');
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
        {/* Inline error message is now replaced by toast notifications */}
      </div>
    </div>
  );
};

export default LoginPage;
