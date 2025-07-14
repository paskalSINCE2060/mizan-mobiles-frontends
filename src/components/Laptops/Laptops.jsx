import React, { useEffect, useState } from 'react';
import './Laptops.css';
import ProductCard from '../common/ProductCard '; 
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Laptops = () => {
  const [Laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    privateInstance.get('/products?category=Laptop')
      .then(res => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        const data = res.data;
        if (Array.isArray(data)) {
          setLaptops(data);
        } else if (data && Array.isArray(data.products)) {
          setLaptops(data.products);
        } else if (data && Array.isArray(data.data)) {
          setLaptops(data.data);
        } else {
          console.error('Unexpected response format:', data);
          setError('Unexpected response format');
          setLaptops([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch Laptops', err);
        setError('Failed to fetch Laptops');
        setLaptops([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Ensure Laptops is always an array before rendering
  const safeLaptops = Array.isArray(Laptops) ? Laptops : [];
  const firstRow = safeLaptops.slice(0, 4);
  const secondRow = safeLaptops.slice(4);

  if (loading) {
    return <div>Loading Laptops...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ToastContainer />
      {[firstRow, secondRow].map((row, idx) => (
        <div className="Laptops-container" key={idx}>
          {row.map(item => (
            <ProductCard key={item._id || item.id} product={item} classPrefix="Laptops-" />
          ))}
        </div>
      ))}
    </>
  );
};

export default Laptops;