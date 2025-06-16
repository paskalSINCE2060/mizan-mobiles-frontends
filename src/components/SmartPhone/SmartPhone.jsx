import React, { useEffect, useState } from 'react';
import './SmartPhone.css';
import ProductCard from '../../components/common/ProductCard ';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmartPhone = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSmartphones = async () => {
      try {
        const res = await privateInstance.get('/products?category=smartphone'); // no /api prefix here
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching smartphones:', err);
      }
    };
    fetchSmartphones();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="smart-phone-container">
        {products.map((phone) => (
          <ProductCard key={phone._id || phone.id} product={phone} classPrefix="smart-phone-" />
        ))}
      </div>
    </>
  );
};

export default SmartPhone;
