import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../apis/category.api.js';
import { useNotify } from '../hooks/useNotify';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Holds the category being edited

  const { notifySuccess, notifyError } = useNotify();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch categories.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [notifyError]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await createCategory({ name: newCategoryName, description: newCategoryDescription });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      notifySuccess('Category created successfully!');
    } catch (err) {
      notifyError(err.message || 'Failed to create category.');
    }
  };

  const handleUpdate = async (category) => {
    try {
      const response = await updateCategory(category._id, { name: category.name, description: category.description });
      setCategories(categories.map(c => c._id === category._id ? response.data : c));
      setEditingCategory(null);
      notifySuccess('Category updated successfully!');
    } catch (err) {
      notifyError(err.message || 'Failed to update category.');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(c => c._id !== categoryId));
        notifySuccess('Category deleted successfully!');
      } catch (err) {
        notifyError(err.message || 'Failed to delete category.');
      }
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading categories...</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Category Management</h1>

      {/* Create Category Form */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Create New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required className="w-full rounded-md dark:bg-gray-700" />
          <input type="text" placeholder="Description (optional)" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} className="w-full rounded-md dark:bg-gray-700" />
        </div>
        <button type="submit" className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Category</button>
      </form>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map(cat => (
            <li key={cat._id} className="p-4 flex justify-between items-center">
              {editingCategory?._id === cat._id ? (
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} className="w-1/3 rounded-md dark:bg-gray-700" />
                  <input type="text" value={editingCategory.description} onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})} className="w-2/3 rounded-md dark:bg-gray-700" />
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                </div>
              )}
              <div className="flex gap-2">
                {editingCategory?._id === cat._id ? (
                  <button onClick={() => handleUpdate(editingCategory)} className="text-green-600 hover:text-green-900">Save</button>
                ) : (
                  <button onClick={() => setEditingCategory(cat)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                )}
                <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
