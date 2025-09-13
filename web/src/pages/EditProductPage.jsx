import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { getProductById, updateProduct } from '../apis/product.api.js';
import { useNotify } from '../hooks/useNotify';

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (err) {
        notifyError(err.message || 'Failed to fetch product details.');
      }
    };
    fetchProduct();
  }, [id, notifyError]);

  const handleUpdateProduct = async (formData) => {
    setIsLoading(true);
    try {
      // The `formData` from ProductForm now correctly includes new images if they were selected.
      // The backend service will handle replacing the old images.
      await updateProduct(id, formData);
      notifySuccess('Product updated successfully!');
      navigate('/dashboard/seller/products');
    } catch (err) {
      notifyError(err.message || 'Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <p className="text-center">Loading product data...</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Product</h1>
      <ProductForm product={product} onSubmit={handleUpdateProduct} isLoading={isLoading} />
    </div>
  );
};

export default EditProductPage;
