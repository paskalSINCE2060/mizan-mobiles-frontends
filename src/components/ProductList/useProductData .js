import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PLACEHOLDER_IMAGE } from './category';

export const useProductData = (token) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Function to handle image errors and prevent infinite loading
  const handleImageError = useCallback((productId, e) => {
    if (!imageErrors.has(productId)) {
      setImageErrors(prev => new Set([...prev, productId]));
      e.target.src = PLACEHOLDER_IMAGE;
    }
  }, [imageErrors]);

  // Function to get safe image URL
  const getSafeImageUrl = useCallback((product) => {
    if (imageErrors.has(product._id)) {
      return PLACEHOLDER_IMAGE;
    }
    return product.image || PLACEHOLDER_IMAGE;
  }, [imageErrors]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mizan-mobile-backend-mizan.up.railway.app/api/products", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const response_data = await response.json();
      console.log('Fetched products data:', response_data);
      
      let productsArray = [];
      if (response_data.success && Array.isArray(response_data.data)) {
        productsArray = response_data.data;
      } else if (Array.isArray(response_data)) {
        productsArray = response_data;
      }
      
      setProducts(productsArray);
      setImageErrors(new Set());
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDelete = useCallback(async (id, productName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/products/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setImageErrors(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success(`"${productName}" deleted successfully!`);
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
      console.error(error);
    }
  }, [token]);

  return {
    products,
    setProducts,
    loading,
    imageErrors,
    setImageErrors,
    handleImageError,
    getSafeImageUrl,
    fetchProducts,
    handleDelete
  };
};