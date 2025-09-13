import { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import GoogleLoginButton from '../components/GoogleLoginButton'; // Import the button
import { register } from '../apis/auth.api.js';
import { useNotify } from '../hooks/useNotify';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      await register(formData);
      notifySuccess('Registration successful! Please check your email to verify your account.');
      setIsRegistered(true);
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
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
        
        {isRegistered ? (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
            <p>Thank you for registering! A verification link has been sent to your email.</p>
          </div>
        ) : (
          <>
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or sign up with</span>
                </div>
              </div>
              <div className="mt-6">
                <GoogleLoginButton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
