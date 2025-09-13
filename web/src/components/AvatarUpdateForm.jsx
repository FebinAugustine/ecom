import { useState } from 'react';

const AvatarUpdateForm = ({ onSubmit, isLoading }) => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (avatar) {
      const formData = new FormData();
      formData.append('avatar', avatar);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Avatar</label>
        <div className="mt-1 flex items-center space-x-4">
          {preview ? (
            <img src={preview} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-800 file:text-indigo-600 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-700"
          />
        </div>
      </div>

      <div>
        <button type="submit" disabled={!avatar || isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          {isLoading ? 'Uploading...' : 'Upload Avatar'}
        </button>
      </div>
    </form>
  );
};

export default AvatarUpdateForm;
