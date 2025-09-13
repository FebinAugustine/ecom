import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../apis/product.api.js';
import { useNotify } from '../hooks/useNotify';

const CreateProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  const handleCreateProduct = async (formData) => {
    setIsLoading(true);
    try {
      await createProduct(formData);
      notifySuccess('Product created successfully!');
      navigate('/dashboard/seller/products'); // Redirect to the product list
    } catch (err) {
      notifyError(err.message || 'Failed to create product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create a New Product</h1>
      <ProductForm onSubmit={handleCreateProduct} isLoading={isLoading} />
    </div>
  );
};

export default CreateProductPage;
