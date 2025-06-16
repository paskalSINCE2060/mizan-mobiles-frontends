import React, { useEffect, useState } from 'react';
import './Airpods.css';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../components/common/ProductCard '; 

const Airpods = () => {
  const [airpods, setAirpods] = useState([]);

  useEffect(() => {
    privateInstance.get('/products?category=earphones')
      .then(res => setAirpods(res.data))
      .catch(err => console.error('Failed to fetch airpods', err));
  }, []);

  const firstRow = airpods.slice(0, 4);
  const secondRow = airpods.slice(4);

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
