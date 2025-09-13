import { useState, useEffect } from 'react';
import { getAllCategories } from '../apis/category.api.js';

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Pre-populate form if we are editing an existing product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || '',
        stock: product.stock || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    images.forEach(image => {
      submissionData.append('images', image);
    });

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
        <input name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea name="description" rows={4} required value={formData.description} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
          <input name="price" type="number" required value={formData.price} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
          <input name="stock" type="number" required value={formData.stock} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select name="category" required value={formData.category} onChange={handleChange} className="mt-1 w-full rounded-md dark:bg-gray-700">
          <option value="" disabled>Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Existing Images Display */}
      {product && product.images && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Images</label>
          <div className="mt-2 flex space-x-4">
            {product.images.map((image, index) => (
              <img key={index} src={image} alt={`Product image ${index + 1}`} className="h-20 w-20 object-cover rounded-md" />
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{product ? 'Upload New Images (optional)' : 'Product Images'}</label>
        <p className="text-xs text-gray-500 dark:text-gray-400">{product ? 'Uploading new images will replace all current images.' : ''}</p>
        <input name="images" type="file" multiple required={!product} onChange={handleImageChange} className="mt-1 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 dark:file:bg-indigo-800 file:text-indigo-600 dark:file:text-indigo-300" />
      </div>

      <div>
        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
          {isLoading ? (product ? 'Updating Product...' : 'Creating Product...') : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
