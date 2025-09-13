import { useState } from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { forgotPassword } from '../apis/auth.api.js';
import { useNotify } from '../hooks/useNotify';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const handleForgotPassword = async ({ email }) => {
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      notifySuccess('If an account with that email exists, a password reset code has been sent.');
      setIsSubmitted(true);
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
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Your Password?</h1>
        
        {isSubmitted ? (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
            <p>Request sent! Please check your email for instructions.</p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-4">No problem. Enter your email address below and we'll send you a code to reset it.</p>
            <ForgotPasswordForm onSubmit={handleForgotPassword} isLoading={isLoading} />
          </>
        )}

        {/* Inline error message is now replaced by toast notifications */}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
