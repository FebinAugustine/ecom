import { useState } from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { resetPassword } from '../apis/auth.api.js';
import { useNotify } from '../hooks/useNotify';

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const handleResetPassword = async (formData) => {
    setIsLoading(true);
    try {
      await resetPassword(formData);
      notifySuccess('Your password has been changed successfully!');
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
        
        <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />

        {/* Inline error and success messages are now replaced by toast notifications */}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
