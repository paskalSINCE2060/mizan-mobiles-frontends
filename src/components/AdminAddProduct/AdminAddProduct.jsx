import React, { useState } from 'react';
import { Upload, Package, Tag, DollarSign, Image, Settings, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import './AdminAddProduct.css';
import { useSelector } from 'react-redux';
import privateInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify'; // Add this import

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
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  // Remove the custom toast state since we're using react-toastify

  const token = useSelector((state) => state.auth.token);
  const BASE_URL = 'http://localhost:5000';

  const validCategories = ['smartphone', 'laptop', 'watch', 'earphones', 'premiumsmartphones', 'galaxyproducts'];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'category', label: 'Category', icon: Tag },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'media', label: 'Media', icon: Image }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!productData.name.trim()) newErrors.name = 'Product name is required';
    if (!productData.description.trim()) newErrors.description = 'Description is required';
    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!productData.category) newErrors.category = 'Category is required';
    if (!imageFile) newErrors.image = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setProductData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value
        }
      }));
    } else {
      setProductData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (errors.image) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }

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
    
    if (!validateForm()) {
      toast.error('Please fix the errors above'); // Use react-toastify
      return;
    }

    if (!token) {
      toast.error('Unauthorized. Please login.'); // Use react-toastify
      return;
    }

    setIsSubmitting(true);

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
        category: productData.category.toLowerCase(),
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
        // Use react-toastify success toast
        toast.success(`Product "${finalProduct.name}" added successfully to ${finalProduct.category} category!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
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
        setActiveTab('basic');
        setErrors({});
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('Error adding product:', err);

      let message = 'Unknown error occurred';
      if (err.response) {
        console.error('Backend error response:', err.response.data);
        message = err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
        message = 'No response from server (possible network or CORS error)';
      } else {
        console.error('Request setup error:', err.message);
        message = err.message;
      }

      // Use react-toastify error toast
      toast.error(`Error adding product: ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
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
      setErrors({});
      setActiveTab('basic');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="tab-content">
            <div className="form-group">
              <label className="form-label">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter product name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Description *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows="4"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Enter product description"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={productData.brand}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Apple, Samsung"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="tab-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Current Price *
                </label>
                <div className="input-with-icon">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    className={`form-input-with-icon ${errors.price ? 'error' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.price && (
                  <p className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Original Price
                </label>
                <div className="input-with-icon">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    name="oldPrice"
                    value={productData.oldPrice}
                    onChange={handleChange}
                    className="form-input-with-icon"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="form-helper">Optional - for displaying discounts</p>
              </div>
            </div>

            {productData.price && productData.oldPrice && Number(productData.oldPrice) > Number(productData.price) && (
              <div className="discount-info">
                <div className="discount-content">
                  <CheckCircle className="discount-icon" />
                  <span className="discount-text">
                    Discount: {Math.round(((Number(productData.oldPrice) - Number(productData.price)) / Number(productData.oldPrice)) * 100)}% off
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 'category':
        return (
          <div className="tab-content">
            <div className="form-group">
              <label className="form-label">
                Category *
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {validCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'premiumsmartphones' ? 'Premium Smartphones' : 
                     cat === 'galaxyproducts' ? 'Galaxy Products' :
                     cat === 'laptop' ? 'Laptop' :
                     cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.category}
                </p>
              )}
            </div>

            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <label className="toggle-label">Featured Product</label>
                  <p className="toggle-description">Display this product prominently</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={productData.featured}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <label className="toggle-label">In Stock</label>
                  <p className="toggle-description">Product availability status</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={productData.inStock}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'specs':
        return (
          <div className="tab-content">
            <div className="specs-grid">
              <div className="form-group">
                <label className="form-label">Storage</label>
                <input
                  type="text"
                  name="specs.storage"
                  value={productData.specs.storage}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 256GB"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display</label>
                <input
                  type="text"
                  name="specs.display"
                  value={productData.specs.display}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 6.7-inch Super Retina XDR OLED"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Battery</label>
                <input
                  type="text"
                  name="specs.battery"
                  value={productData.specs.battery}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Up to 29 hours video playback"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Camera</label>
                <input
                  type="text"
                  name="specs.camera"
                  value={productData.specs.camera}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Triple 48MP camera system"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Connectivity</label>
                <input
                  type="text"
                  name="specs.connectivity"
                  value={productData.specs.connectivity}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 5G, Wi-Fi 6"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features</label>
                <input
                  type="text"
                  name="specs.features"
                  value={productData.specs.features}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Face ID, Wireless Charging"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sensors</label>
                <input
                  type="text"
                  name="specs.sensors"
                  value={productData.specs.sensors}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Accelerometer, Gyroscope"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="specs.color"
                  value={productData.specs.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Space Black, Silver"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="tab-content">
            <div className="form-group">
              <label className="form-label">
                Product Image *
              </label>
              <div className={`image-upload-area ${errors.image ? 'error' : ''} ${imagePreview ? 'has-image' : ''}`}>
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                    <div className="image-actions">
                      <button
                        type="button"
                        onClick={() => document.getElementById('image-upload').click()}
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        <Upload className="btn-icon" />
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          document.getElementById('image-upload').value = '';
                        }}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                      >
                        <X className="btn-icon" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="upload-icon" />
                    <div className="upload-content">
                      <button
                        type="button"
                        onClick={() => document.getElementById('image-upload').click()}
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        <Upload className="btn-icon" />
                        Upload Image
                      </button>
                      <p className="upload-text">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.image}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        <div className="admin-card">
          {/* Header */}
          <div className="admin-header">
            <div className="header-content">
              <div className="header-icon">
                <Package className="icon" />
              </div>
              <div className="header-text">
                <h1 className="header-title">Add New Product</h1>
                <p className="header-subtitle">Fill in the details to add a new product to your inventory</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <nav className="tabs-nav">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon className="tab-icon" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="content-container">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="admin-footer">
            <div className="footer-content">
              <div className="footer-left">
                {Object.keys(errors).length > 0 && (
                  <span className="error-summary">
                    <AlertCircle className="error-icon" />
                    Please fix the errors above
                  </span>
                )}
              </div>
              <div className="footer-right">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Save className="btn-icon" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove the custom toast JSX since we're using react-toastify */}
    </div>
  );
};

export default AdminAddProduct;