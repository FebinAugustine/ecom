import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import AvatarUpdateForm from '../components/AvatarUpdateForm';
import DeleteAccount from '../components/DeleteAccount';
import { updateUserProfile, updateUserAvatar, deleteAccount, getCurrentUser } from '../apis/user.api.js';
import { useNotify } from '../hooks/useNotify';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return <p className="text-center">Loading user data...</p>;
  }

  const refetchUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      notifyError("Could not refresh user data.");
    }
  };

  const handleUpdateProfile = async (formData) => {
    setIsInfoLoading(true);
    try {
      await updateUserProfile(formData);
      await refetchUser();
      notifySuccess('Profile updated successfully!');
    } catch (err) {
      notifyError(err.message || 'Failed to update profile.');
    } finally {
      setIsInfoLoading(false);
    }
  };

  const handleUpdateAvatar = async (formData) => {
    setIsAvatarLoading(true);
    try {
      await updateUserAvatar(formData);
      await refetchUser();
      notifySuccess('Avatar updated successfully!');
    } catch (err) {
      notifyError(err.message || 'Failed to update avatar.');
    } finally {
      setIsAvatarLoading(false);
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      notifySuccess('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      notifyError(err.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>

      {/* Profile Display Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-6">
          <img 
            src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`} 
            alt="User Avatar" 
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <span className="mt-2 inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Personal Information</h3>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.phone || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.address || 'Not provided'}</dd>
            </div>
          </dl>
        </div>
        {user.role === 'SELLER' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Seller Information</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.companyName || 'Not provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">GST Number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.gst || 'Not provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">PAN Number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.pan || 'Not provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aadhar Number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.aadhar || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Update Forms Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Update Your Information</h2>
          <ProfileUpdateForm user={user} onSubmit={handleUpdateProfile} isLoading={isInfoLoading} />
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-center mb-4">Update Your Avatar</h2>
            <AvatarUpdateForm onSubmit={handleUpdateAvatar} isLoading={isAvatarLoading} />
          </div>
          <DeleteAccount onConfirm={handleDeleteAccount} isLoading={isDeleting} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
