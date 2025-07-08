import React, { useEffect, useState } from 'react';
import './Tablets.css';
import ProductCard from '../../components/common/ProductCard '; 
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tablets = () => {
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    privateInstance.get('/products?category=tablet')
      .then(res => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        const data = res.data;
        if (Array.isArray(data)) {
          setTablets(data);
        } else if (data && Array.isArray(data.products)) {
          setTablets(data.products);
        } else if (data && Array.isArray(data.data)) {
          setTablets(data.data);
        } else {
          console.error('Unexpected response format:', data);
          setError('Unexpected response format');
          setTablets([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch tablets', err);
        setError('Failed to fetch tablets');
        setTablets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Ensure tablets is always an array before rendering
  const safeTablets = Array.isArray(tablets) ? tablets : [];
  const firstRow = safeTablets.slice(0, 4);
  const secondRow = safeTablets.slice(4);

  if (loading) {
    return <div>Loading tablets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ToastContainer />
      {[firstRow, secondRow].map((row, idx) => (
        <div className="Tablets-container" key={idx}>
          {row.map(item => (
            <ProductCard key={item._id || item.id} product={item} classPrefix="Tablets-" />
          ))}
        </div>
      ))}
    </>
  );
};

export default Tablets;