import React, { useEffect, useState } from 'react';
import './Airpods.css';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../components/common/ProductCard '; 

const Airpods = () => {
  const [airpods, setAirpods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirpods = async () => {
      try {
        setLoading(true);
        const res = await privateInstance.get('/products?category=earphones');
        
        // Check if response data is an array
        if (Array.isArray(res.data)) {
          setAirpods(res.data);
        } else if (res.data && Array.isArray(res.data.products)) {
          // Handle case where data is nested (e.g., { products: [...] })
          setAirpods(res.data.products);
        } else if (res.data && Array.isArray(res.data.data)) {
          // Handle case where data is nested (e.g., { data: [...] })
          setAirpods(res.data.data);
        } else {
          console.error('Unexpected API response structure:', res.data);
          setError('Unexpected data format from server');
          setAirpods([]);
        }
      } catch (err) {
        console.error('Failed to fetch airpods', err);
        setError('Failed to load products');
        setAirpods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAirpods();
  }, []);

  // Ensure airpods is always an array before using slice
  const airpodsArray = Array.isArray(airpods) ? airpods : [];
  const firstRow = airpodsArray.slice(0, 4);
  const secondRow = airpodsArray.slice(4);

  if (loading) {
    return (
      <div className="airpods-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="airpods-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (airpodsArray.length === 0) {
    return (
      <div className="airpods-container">
        <p>No airpods found.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      {[firstRow, secondRow].map((row, idx) => (
        <div className="airpods-container" key={idx}>
          {row.map((item) => (
            <ProductCard key={item._id || item.id} product={item} classPrefix="airpods-" />
          ))}
        </div>
      ))}
    </>
  );
};

export default Airpods;