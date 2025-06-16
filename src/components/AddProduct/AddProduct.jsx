import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance'; // Default import, NOT { privateInstance }
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      errs.price = 'Price must be a positive number';
    const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
    if (!imageUrlRegex.test(formData.image))
      errs.image = 'Enter a valid image URL (jpg/png/gif/webp)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
       await axiosInstance.post('/products', formData); // Notice the URL is '/products' since baseURL already includes /api

      alert('Product added successfully!');
      navigate('/products');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
          />
          {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
          />
          {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
        </div>
        <div>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            value={formData.image}
          />
          {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
