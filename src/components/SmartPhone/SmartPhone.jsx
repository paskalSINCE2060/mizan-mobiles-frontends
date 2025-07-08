import React, { useEffect, useState } from 'react';
import './SmartPhone.css';
import ProductCard from '../../components/common/ProductCard ';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmartPhone = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSmartphones = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await privateInstance.get('/products?category=smartphone');
        
        // Debug: Log the response to see the structure
        console.log('API Response:', res.data);
        
        // Handle different possible response structures
        let productsData = [];
        
        if (Array.isArray(res.data)) {
          // If response is directly an array
          productsData = res.data;
        } else if (res.data && Array.isArray(res.data.products)) {
          // If response has a products property that is an array
          productsData = res.data.products;
        } else if (res.data && Array.isArray(res.data.data)) {
          // If response has a data property that is an array
          productsData = res.data.data;
        } else {
          // If it's some other structure, try to handle it
          console.warn('Unexpected API response structure:', res.data);
          productsData = [];
        }
        
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching smartphones:', err);
        setError('Failed to fetch smartphones. Please try again.');
        setProducts([]); // Ensure products is always an array
      } finally {
        setLoading(false);
      }
    };
    
    fetchSmartphones();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="smart-phone-container">
          <div className="loading-message">Loading smartphones...</div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="smart-phone-container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  // Show no products message
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <>
        <ToastContainer />
        <div className="smart-phone-container">
          <div className="no-products-message">No smartphones found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="smart-phone-container">
        {products.map((phone) => (
          <ProductCard 
            key={phone._id || phone.id || Math.random()} 
            product={phone} 
            classPrefix="smart-phone-" 
          />
        ))}
      </div>
    </>
  );
};

export default SmartPhone;