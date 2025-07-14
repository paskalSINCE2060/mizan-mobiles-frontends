import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import './AdminAddOffer.css';

// Move predefinedCategories outside component to prevent re-creation on each render
const predefinedCategories = [
  'All Brands',
  'Apple',
  'Samsung',
  'OnePlus',
  'Xiaomi',
  'Google',
  'Huawei',
  'Accessories',
  'Gaming Phones',
  'Budget Phones',
  'Flagship Phones'
];

const AdminAddOffer = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    discountValue: '',
    validFrom: '',
    validUntil: '',
    category: '',
    promoCode: '',
    image: null,
    isActive: true,
    redemptionSteps: [''],
    productDetails: {
      name: '',
      price: '',
      discountedPrice: '',
      originalPrice: '',
      specs: ''
    },
    maxRedemptions: '',
    targetProducts: []
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [existingOffers, setExistingOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Memoize fetch functions to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.warn('Products API not available, using empty array');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFetchError('Could not load products. Product selection will be limited.');
    }
  }, []);

  const fetchExistingOffers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/special-offers');
      if (response.ok) {
        const data = await response.json();
        // Handle both array response and object with offers property
        const offers = Array.isArray(data) ? data : (data.offers || []);
        setExistingOffers(offers);
      } else {
        console.warn('Special offers API returned error:', response.status);
        setExistingOffers([]);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setExistingOffers([]);
      if (!fetchError) {
        setFetchError('Could not load existing offers.');
      }
    }
  }, [fetchError]);

  useEffect(() => {
    const initializeData = async () => {
      setCategories(predefinedCategories);
      await Promise.all([
        fetchProducts(),
        fetchExistingOffers()
      ]);
    };

    initializeData();
  }, [fetchProducts, fetchExistingOffers]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('productDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        productDetails: {
          ...prev.productDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Auto-generate promo code when title changes
    if (name === 'title' && value && !editingOffer) {
      const promoCode = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8) + Math.floor(Math.random() * 100);
      setFormData(prev => ({
        ...prev,
        promoCode: promoCode
      }));
    }

    // Calculate discounted price when discount changes
    if (name === 'discountValue' || name === 'productDetails.originalPrice') {
      setTimeout(() => calculateDiscountedPrice(), 0);
    }
  };

  const calculateDiscountedPrice = () => {
    const originalPrice = parseFloat(formData.productDetails.originalPrice) || 0;
    const discountValue = parseFloat(formData.discountValue) || 0;
    
    let discountedPrice = originalPrice;
    
    if (formData.discountType === 'percentage') {
      discountedPrice = originalPrice - (originalPrice * discountValue / 100);
    } else if (formData.discountType === 'fixed') {
      discountedPrice = originalPrice - discountValue;
    }
    
    setFormData(prev => ({
      ...prev,
      productDetails: {
        ...prev.productDetails,
        discountedPrice: discountedPrice.toFixed(2)
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRedemptionStepChange = (index, value) => {
    const newSteps = [...formData.redemptionSteps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      redemptionSteps: newSteps
    }));
  };

  const addRedemptionStep = () => {
    setFormData(prev => ({
      ...prev,
      redemptionSteps: [...prev.redemptionSteps, '']
    }));
  };

  const removeRedemptionStep = (index) => {
    if (formData.redemptionSteps.length > 1) {
      const newSteps = formData.redemptionSteps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        redemptionSteps: newSteps
      }));
    }
  };

  const handleTargetProductsChange = (productId, isSelected) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        targetProducts: [...prev.targetProducts, productId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        targetProducts: prev.targetProducts.filter(id => id !== productId)
      }));
    }
  };

  const validateForm = () => {
    const required = ['title', 'description', 'discount', 'validFrom', 'validUntil', 'category', 'promoCode'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    // Validate dates
    const validFrom = new Date(formData.validFrom);
    const validUntil = new Date(formData.validUntil);
    const now = new Date();

    if (validFrom >= validUntil) {
      toast.error('Valid Until date must be after Valid From date');
      return false;
    }

    if (validUntil <= now && !editingOffer) {
      toast.error('Valid Until date must be in the future');
      return false;
    }

    // Validate discount value
    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error('Please enter a valid discount value');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'productDetails') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'redemptionSteps' || key === 'targetProducts') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingOffer 
        ? `http://localhost:5000/api/special-offers/${editingOffer._id}`
        : 'http://localhost:5000/api/special-offers';
      
      const method = editingOffer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (response.ok) {
        await response.json();
        
        if (editingOffer) {
          toast.success('Special offer updated successfully! 🎉');
        } else {
          toast.success('Special offer created successfully! 🎉');
          resetForm();
        }
        
        // Refresh the offers list to show the new/updated offer
        await fetchExistingOffers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save special offer');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      discountValue: '',
      validFrom: '',
      validUntil: '',
      category: '',
      promoCode: '',
      image: null,
      isActive: true,
      redemptionSteps: [''],
      productDetails: {
        name: '',
        price: '',
        discountedPrice: '',
        originalPrice: '',
        specs: ''
      },
      maxRedemptions: '',
      targetProducts: []
    });
    setImagePreview('');
    setEditingOffer(null);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      ...offer,
      validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().split('T')[0] : '',
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : '',
      maxRedemptions: offer.maxRedemptions || '',
      redemptionSteps: offer.redemptionSteps && offer.redemptionSteps.length > 0 ? offer.redemptionSteps : [''],
      targetProducts: offer.targetProducts || [],
      productDetails: offer.productDetails || {
        name: '',
        price: '',
        discountedPrice: '',
        originalPrice: '',
        specs: ''
      }
    });
    setImagePreview(offer.image || '');
    toast.info('Offer loaded for editing');
  };

  const handleDelete = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this special offer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/special-offers/${offerId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Special offer deleted successfully!');
          await fetchExistingOffers();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete special offer');
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/special-offers/${offerId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        await fetchExistingOffers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update offer status');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const getOfferRealStatus = (offer) => {
    const currentDate = new Date();
    const isTimeValid = new Date(offer.validUntil) >= currentDate;
    const isManuallyActive = offer.isActive;
    
    if (!isManuallyActive) {
      return { status: 'inactive', reason: 'Manually deactivated' };
    }
    
    if (!isTimeValid) {
      return { status: 'expired', reason: 'Expired' };
    }
    
    return { status: 'active', reason: 'Active' };
  };

  return (
    <div className="admin-add-offer">
      <div className="admin-header">
        <h2>{editingOffer ? 'Edit Special Offer' : 'Add Special Offer'}</h2>
        {editingOffer && (
          <button type="button" onClick={resetForm} className="btn-secondary">
            Add New Offer
          </button>
        )}
      </div>

      {fetchError && (
        <div className="message warning">
          <strong>Warning:</strong> {fetchError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter offer title"
                maxLength="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter offer description"
                rows="4"
                maxLength="500"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Offer Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          {/* Discount Information */}
          <div className="form-section">
            <h3>Discount Information</h3>
            <div className="form-group">
              <label htmlFor="discount">Discount Display Text *</label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="e.g., 20% OFF or $50 OFF"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discountType">Discount Type</label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="discountValue">Discount Value *</label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="promoCode">Promo Code *</label>
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleInputChange}
                placeholder="Enter promo code"
                maxLength="20"
                required
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="form-section">
            <h3>Validity Period</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="validFrom">Valid From *</label>
                <input
                  type="date"
                  id="validFrom"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="validUntil">Valid Until *</label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="maxRedemptions">Max Redemptions</label>
              <input
                type="number"
                id="maxRedemptions"
                name="maxRedemptions"
                value={formData.maxRedemptions}
                onChange={handleInputChange}
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="isActive" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Active Offer
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="form-section">
            <h3>Product Details</h3>
            <div className="form-group">
              <label htmlFor="productDetails.name">Product Name</label>
              <input
                type="text"
                id="productDetails.name"
                name="productDetails.name"
                value={formData.productDetails.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="productDetails.originalPrice">Original Price</label>
                <input
                  type="number"
                  id="productDetails.originalPrice"
                  name="productDetails.originalPrice"
                  value={formData.productDetails.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productDetails.discountedPrice">Discounted Price</label>
                <input
                  type="number"
                  id="productDetails.discountedPrice"
                  name="productDetails.discountedPrice"
                  value={formData.productDetails.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productDetails.specs">Product Specifications</label>
              <textarea
                id="productDetails.specs"
                name="productDetails.specs"
                value={formData.productDetails.specs}
                onChange={handleInputChange}
                placeholder="Enter product specifications"
                rows="3"
              />
            </div>
          </div>

          {/* Redemption Steps */}
          <div className="form-section">
            <h3>Redemption Steps</h3>
            {formData.redemptionSteps.map((step, index) => (
              <div key={index} className="redemption-step">
                <div className="form-group">
                  <label htmlFor={`step-${index}`}>Step {index + 1}</label>
                  <div className="step-input-group">
                    <input
                      type="text"
                      id={`step-${index}`}
                      value={step}
                      onChange={(e) => handleRedemptionStepChange(index, e.target.value)}
                      placeholder={`Enter step ${index + 1}`}
                    />
                    {formData.redemptionSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRedemptionStep(index)}
                        className="btn-remove-step"
                        title="Remove step"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRedemptionStep}
              className="btn-add-step"
            >
              + Add Step
            </button>
          </div>

          {/* Target Products */}
          {products.length > 0 && (
            <div className="form-section">
              <h3>Target Products (Optional)</h3>
              <p className="section-description">
                Select specific products this offer applies to. Leave empty to apply to all products.
              </p>
              <div className="products-list">
                {products.map(product => (
                  <label key={product._id} className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.targetProducts.includes(product._id)}
                      onChange={(e) => handleTargetProductsChange(product._id, e.target.checked)}
                    />
                    <span className="product-name">
                      {product.name} - ${product.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary"
            disabled={isLoading}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
          </button>
        </div>
      </form>

      {/* Existing Offers List */}
      <div className="existing-offers">
        <h3>Existing Special Offers ({existingOffers.length})</h3>
        {existingOffers.length === 0 ? (
          <p className="no-offers">No special offers found.</p>
        ) : (
          <div className="offers-grid">
            {existingOffers.map(offer => (
              <div key={offer._id} className={`offer-card ${!offer.isActive ? 'inactive' : ''}`}>
                
                <div className="offer-header">
                  <h4>{offer.title}</h4>
                  <div className="offer-status">
                    {(() => {
                      const offerStatus = getOfferRealStatus(offer);
                      return (
                        <>
                          <span className={`status-badge ${offerStatus.status}`}>
                            {offerStatus.reason}
                          </span>

                        </>
                      );
                    })()}
                  </div>
                </div>
                
                {offer.image && (
                  <div className="offer-image">
                    <img src={`http://localhost:5000${offer.image}`} alt={offer.title} />
                  </div>
                )}
                
                <div className="offer-details">
                  <p className="offer-description">{offer.description}</p>
                  <div className="offer-meta">
                    <span className="discount">{offer.discount}</span>
                    <span className="category">{offer.category}</span>
                    <span className="promo-code">Code: {offer.promoCode}</span>
                  </div>
                  
                  <div className="offer-dates">
                    <span>Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                  
                  {offer.maxRedemptions && (
                    <div className="redemption-info">
                      <span>Redemptions: {offer.currentRedemptions || 0} / {offer.maxRedemptions}</span>
                    </div>
                  )}
                </div>
                
                <div className="offer-actions">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="btn-edit"
                    title="Edit offer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                    className={`btn-toggle ${offer.isActive ? 'deactivate' : 'activate'}`}
                    title={offer.isActive ? 'Deactivate offer' : 'Activate offer'}
                  >
                    {offer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="btn-delete"
                    title="Delete offer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddOffer;