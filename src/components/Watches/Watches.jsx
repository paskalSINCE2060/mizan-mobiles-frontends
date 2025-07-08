import React, { useEffect, useState } from 'react';
import './Watches.css';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../components/common/ProductCard '; 

const Watches = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    privateInstance.get('/products?category=watch')
      .then(res => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        const data = res.data;
        if (Array.isArray(data)) {
          setWatches(data);
        } else if (data && Array.isArray(data.products)) {
          setWatches(data.products);
        } else if (data && Array.isArray(data.data)) {
          setWatches(data.data);
        } else {
          console.error('Unexpected response format:', data);
          setError('Unexpected response format');
          setWatches([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch watches', err);
        setError('Failed to fetch watches');
        setWatches([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Ensure watches is always an array before rendering
  const safeWatches = Array.isArray(watches) ? watches : [];

  if (loading) {
    return <div>Loading watches...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="watches-container">
        {safeWatches.map((item) => (
          <ProductCard key={item._id || item.id} product={item} classPrefix="watches-" />
        ))}
      </div>
    </>
  );
};

export default Watches;