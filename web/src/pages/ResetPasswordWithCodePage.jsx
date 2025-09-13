import { useState } from 'react';
import { Link } from 'react-router-dom';
import ResetPasswordWithCodeForm from '../components/ResetPasswordWithCodeForm';
import { resetPasswordWithCode } from '../apis/auth.api.js';
import { useNotify } from '../hooks/useNotify';

const ResetPasswordWithCodePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const handleResetPassword = async (formData) => {
    setIsLoading(true);
    try {
      await resetPasswordWithCode(formData);
      notifySuccess('Your password has been reset successfully!');
      setIsSuccess(true);
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
        <h1 className="text-3xl font-bold text-center mb-6">Reset Your Password</h1>
        
        {isSuccess ? (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
            <p>Success! You can now log in with your new password.</p>
            <Link to="/login" className="mt-4 inline-block text-indigo-600 hover:underline">Proceed to Login</Link>
          </div>
        ) : (
          <ResetPasswordWithCodeForm onSubmit={handleResetPassword} isLoading={isLoading} />
        )}

        {/* Inline error message is now replaced by toast notifications */}
      </div>
    </div>
  );
};

export default ResetPasswordWithCodePage;
