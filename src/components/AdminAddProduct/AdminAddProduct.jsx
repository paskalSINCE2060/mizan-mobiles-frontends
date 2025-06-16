import React, { useState } from 'react';
import privateInstance from '../../services/axiosInstance';
import './AdminAddProduct.css';
import { useSelector } from 'react-redux';

const AdminAddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For showing thumbnail

  const token = useSelector((state) => state.auth.token);

  const validCategories = ['smartphone', 'tablet', 'watch', 'earphones'];

  // Base URL: you can configure it in env or hardcode here
  const BASE_URL = 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Show image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const postWithAuth = async (url, data, config = {}) => {
    return privateInstance.post(url, data, {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(config.headers || {}),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Unauthorized. Please login.');
      return;
    }

    if (!validCategories.includes(productData.category.toLowerCase())) {
      alert(`Invalid category. Choose one of: ${validCategories.join(', ')}`);
      return;
    }

    try {
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await postWithAuth(`${BASE_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Ensure backend returns something like { imageUrl: "/uploads/filename.ext" }
        const rawImageUrl = uploadRes.data.imageUrl;
        imageUrl = rawImageUrl.startsWith('http') ? rawImageUrl : `${BASE_URL}${rawImageUrl}`;

      }

      const finalProduct = {
    ...productData,
      price: Number(productData.price),       // convert string to number
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : undefined, // optional convert
      category: productData.category.toLowerCase(),
      image: imageUrl,
      };
      console.log('Final Payload:', finalProduct);
      await postWithAuth(`${BASE_URL}/api/products`, finalProduct);

      alert('Product added successfully!');
      setProductData({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        category: '',
        image: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Axios error:', err);

      // Try to get detailed error message if possible
      let message = 'Unknown error';
      if (err.response) {
        // Backend responded with error
        message = err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err.request) {
        // Request was made but no response
        message = 'No response from server (possible network or CORS error)';
      } else {
        // Other errors
        message = err.message;
      }

      alert(`Error adding product: ${message}`);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="oldPrice"
          placeholder="Old Price"
          value={productData.oldPrice}
          onChange={handleChange}
        />

        {/* Dropdown for category */}
        <select
          name="category"
          value={productData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {validCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Image file input */}
        <input type="file" accept="image/*" onChange={handleImageChange} required />

        {/* Image preview thumbnail */}
        {imagePreview && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
