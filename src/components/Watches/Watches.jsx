import React, { useEffect, useState } from 'react';
import './Watches.css';
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../../components/common/ProductCard '; 

const Watches = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    privateInstance.get('/products?category=watch')
      .then(res => setWatches(res.data))
      .catch(err => console.error('Failed to fetch watches', err));
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="watches-container">
        {watches.map((item) => (
          <ProductCard key={item._id || item.id} product={item} classPrefix="watches-" />
        ))}
      </div>
    </>
  );
};

export default Watches;
