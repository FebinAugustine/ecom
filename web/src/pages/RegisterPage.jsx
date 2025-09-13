import { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
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
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        )}

        {/* Inline error and success messages are now replaced by toast notifications */}
      </div>
    </div>
  );
};

export default RegisterPage;
