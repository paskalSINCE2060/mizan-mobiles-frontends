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
    brand: '',
    featured: false,
    inStock: true,
    image: '',
    specs: {
      storage: '',
      display: '',
      battery: '',
      camera: '',
      connectivity: '',
      features: '',
      sensors: '',
      color: ''
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state) => state.auth.token);

  // ✅ UPDATED: Added 'galaxyproducts' category
  const validCategories = ['smartphone', 'tablet', 'watch', 'earphones', 'premiumsmartphones', 'galaxyproducts'];

  // Base URL: you can configure it in env or hardcode here
  const BASE_URL = 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setProductData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value
        }
      }));
    } else {
      setProductData((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
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
    setIsSubmitting(true);

    if (!token) {
      alert('Unauthorized. Please login.');
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!productData.name.trim()) {
      alert('Product name is required');
      setIsSubmitting(false);
      return;
    }

    if (!productData.description.trim()) {
      alert('Product description is required');
      setIsSubmitting(false);
      return;
    }

    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      alert('Valid price is required');
      setIsSubmitting(false);
      return;
    }

    if (!productData.category) {
      alert('Category is required');
      setIsSubmitting(false);
      return;
    }

    if (!validCategories.includes(productData.category.toLowerCase())) {
      alert(`Invalid category. Choose one of: ${validCategories.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    if (!imageFile) {
      alert('Product image is required');
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';

      // Upload image first
      if (imageFile) {
        console.log('Uploading image...');
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await postWithAuth(`${BASE_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Image upload response:', uploadRes.data);

        // Ensure backend returns something like { imageUrl: "/uploads/filename.ext" }
        const rawImageUrl = uploadRes.data.imageUrl;
        imageUrl = rawImageUrl.startsWith('http') ? rawImageUrl : `${BASE_URL}${rawImageUrl}`;
        console.log('Final image URL:', imageUrl);
      }

      // Clean up specs - remove empty fields
      const cleanSpecs = Object.fromEntries(
        Object.entries(productData.specs).filter(([key, value]) => value.trim() !== '')
      );

      const finalProduct = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: Number(productData.price),
        oldPrice: productData.oldPrice ? Number(productData.oldPrice) : undefined,
        category: productData.category.toLowerCase(), // ✅ Ensure lowercase
        brand: productData.brand.trim() || 'Unknown',
        featured: Boolean(productData.featured),
        inStock: Boolean(productData.inStock),
        image: imageUrl,
        specs: cleanSpecs
      };

      console.log('Final Product Payload:', finalProduct);
      
      const response = await postWithAuth(`${BASE_URL}/api/products`, finalProduct);
      console.log('Product creation response:', response.data);
      
      if (response.data.success) {
        alert(`Product added successfully to ${finalProduct.category} category!`);
        
        // Reset form
        setProductData({
          name: '',
          description: '',
          price: '',
          oldPrice: '',
          category: '',
          brand: '',
          featured: false,
          inStock: true,
          image: '',
          specs: {
            storage: '',
            display: '',
            battery: '',
            camera: '',
            connectivity: '',
            features: '',
            sensors: '',
            color: ''
          }
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('Error adding product:', err);

      // Try to get detailed error message if possible
      let message = 'Unknown error occurred';
      if (err.response) {
        // Backend responded with error
        console.error('Backend error response:', err.response.data);
        message = err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err.request) {
        // Request was made but no response
        console.error('No response received:', err.request);
        message = 'No response from server (possible network or CORS error)';
      } else {
        // Other errors
        console.error('Request setup error:', err.message);
        message = err.message;
      }

      alert(`Error adding product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        {/* Basic Product Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <input
            type="text"
            name="name"
            placeholder="Product Name *"
            value={productData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          
          <textarea
            name="description"
            placeholder="Description *"
            value={productData.description}
            onChange={handleChange}
            required
            rows="4"
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="brand"
            placeholder="Brand (e.g., Apple, Samsung)"
            value={productData.brand}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h3>Pricing</h3>
          
          <input
            type="number"
            name="price"
            placeholder="Current Price *"
            value={productData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            disabled={isSubmitting}
          />
          
          <input
            type="number"
            name="oldPrice"
            placeholder="Original Price (optional)"
            value={productData.oldPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            disabled={isSubmitting}
          />
        </div>

        {/* Category and Status */}
        <div className="form-section">
          <h3>Category & Status</h3>
          
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select Category *
            </option>
            {validCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'premiumsmartphones' ? 'Premium Smartphones' : 
                 cat === 'galaxyproducts' ? 'Galaxy Products' :
                 cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={productData.featured}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Featured Product
            </label>
            
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={productData.inStock}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              In Stock
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="form-section">
          <h3>Specifications</h3>
          
          <input
            type="text"
            name="specs.storage"
            placeholder="Storage (e.g., 256GB)"
            value={productData.specs.storage}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.display"
            placeholder="Display (e.g., 6.7-inch Super Retina XDR OLED)"
            value={productData.specs.display}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.battery"
            placeholder="Battery (e.g., Up to 29 hours video playback)"
            value={productData.specs.battery}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.camera"
            placeholder="Camera (e.g., Triple 48MP camera system)"
            value={productData.specs.camera}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.connectivity"
            placeholder="Connectivity (e.g., 5G, Wi-Fi 6)"
            value={productData.specs.connectivity}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.features"
            placeholder="Features (e.g., Face ID, Wireless Charging)"
            value={productData.specs.features}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.sensors"
            placeholder="Sensors (e.g., Accelerometer, Gyroscope)"
            value={productData.specs.sensors}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          
          <input
            type="text"
            name="specs.color"
            placeholder="Color (e.g., Space Black, Silver)"
            value={productData.specs.color}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Image Upload */}
        <div className="form-section">
          <h3>Product Image</h3>
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            required 
            disabled={isSubmitting}
          />

          {/* Image preview thumbnail */}
          {imagePreview && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '5px'
                }}
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4>Debug Info:</h4>
          <p><strong>Selected Category:</strong> {productData.category}</p>
          <p><strong>Valid Categories:</strong> {validCategories.join(', ')}</p>
          <p><strong>Image Selected:</strong> {imageFile ? imageFile.name : 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;