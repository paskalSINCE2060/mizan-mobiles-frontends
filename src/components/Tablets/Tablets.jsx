import React, { useEffect, useState } from 'react';
import './Tablets.css';
import ProductCard from '../../components/common/ProductCard '; 
import privateInstance from '../../services/axiosInstance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tablets = () => {
  const [tablets, setTablets] = useState([]);

  useEffect(() => {
    privateInstance.get('/products?category=tablet')
      .then(res => setTablets(res.data))
      .catch(err => console.error('Failed to fetch tablets', err));
  }, []);

  const firstRow = tablets.slice(0, 4);
  const secondRow = tablets.slice(4);

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
