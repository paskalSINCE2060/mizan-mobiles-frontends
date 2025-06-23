import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  submitSellPhoneRequest, 
  resetSubmitState,
  selectSubmitLoading,
  selectSubmitSuccess,
  selectSubmitError
} from '../../slice/sellPhoneSlice';
import "./SellYourPhone.css"

const SellYourPhone = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const submitLoading = useSelector(selectSubmitLoading);
  const submitSuccess = useSelector(selectSubmitSuccess);
  const submitError = useSelector(selectSubmitError);

  const [phoneDetails, setPhoneDetails] = useState({
    brand: '',
    model: '',
    condition: 'good',
    storage: '',
    color: '', // Added color field
    expectedPrice: '', // Added expected price field
    hasCharger: false,
    contactEmail: '',
    contactPhone: '',
    fullName: '', // Added full name field
    description: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  

  // Reset form and clear messages on component mount
  useEffect(() => {
    dispatch(resetSubmitState());
    
    // Load user data from localStorage if available
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setPhoneDetails(prev => ({
        ...prev,
        contactEmail: loggedInUser.email || '',
        contactPhone: loggedInUser.phone || loggedInUser.number || '',
        fullName: loggedInUser.fullName || loggedInUser.name || ''
      }));
    }
  }, [dispatch]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetSubmitState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPhoneDetails({
      ...phoneDetails,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setValidationError('Please upload only JPEG, PNG, or GIF images');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setValidationError('');
    }
  };

  const validateForm = () => {
    const { brand, model, condition, storage, color, expectedPrice, contactEmail, contactPhone, fullName } = phoneDetails;
    
    // Check if fullName is provided and not just whitespace
    if (!fullName || fullName.trim() === '') {
      setValidationError('Full name is required');
      return false;
    }

    if (!brand || !model || !condition || !storage || !color || !expectedPrice || !contactEmail || !contactPhone) {
      setValidationError('Please fill in all required fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]{10,20}$/;
    if (!phoneRegex.test(contactPhone)) {
      setValidationError('Please enter a valid phone number');
      return false;
    }

    // Expected price validation
    const price = parseFloat(expectedPrice);
    if (isNaN(price) || price <= 0) {
      setValidationError('Please enter a valid expected price');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: log phoneDetails before validation
    console.log('phoneDetails before submit:', phoneDetails);
    
    if (!validateForm()) {
      return;
    }

    setValidationError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all form fields - ensure fullName is properly included
      Object.keys(phoneDetails).forEach(key => {
        const value = phoneDetails[key];
        // Convert boolean to string for FormData
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString().trim());
        }
      });

      // Debug: log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Append image file if selected
      if (selectedFile) {
        formData.append('phoneImage', selectedFile);
      }

      // Dispatch the Redux action
      await dispatch(submitSellPhoneRequest(formData)).unwrap();
      
      // Reset form on success (but keep user details)
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setPhoneDetails({
        brand: '',
        model: '',
        condition: 'good',
        storage: '',
        color: '',
        expectedPrice: '',
        hasCharger: false,
        contactEmail: loggedInUser?.email || '',
        contactPhone: loggedInUser?.phone || loggedInUser?.number || '',
        fullName: loggedInUser?.fullName || loggedInUser?.name || '',
        description: ''
      });
      setPreviewImage(null);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('phoneImage');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      // Error is handled by Redux slice
      console.error('Submission error:', error);
    }
  };

  // Determine which message to show
  const getDisplayMessage = () => {
    if (validationError) return { message: validationError, type: 'error' };
    if (submitError) return { message: submitError, type: 'error' };
    if (submitSuccess) return { 
      message: 'Your phone selling request has been submitted successfully! We will contact you within 24 hours with a quote.', 
      type: 'success' 
    };
    return null;
  };

  const displayMessage = getDisplayMessage();

  return (
    <>
      <div className="sale-me-your-phone-container">
        <div className="sale-me-your-phone-header">
          <h1>Sell Your Phone</h1>
          <p>Get the best price for your used phone today!</p>
        </div>

        <div className="sale-me-your-phone-content">
          <div className="sale-me-your-phone-info-section">
            <h2>How It Works</h2>
            <div className="sale-me-your-phone-steps">
              <div className="sale-me-your-phone-step">
                <div className="sale-me-your-phone-step-number">1</div>
                <div className="sale-me-your-phone-step-text">
                  <h3>Fill Out The Form</h3>
                  <p>Tell us about your phone and its condition</p>
                </div>
              </div>
              <div className="sale-me-your-phone-step">
                <div className="sale-me-your-phone-step-number">2</div>
                <div className="sale-me-your-phone-step-text">
                  <h3>Get a Quote</h3>
                  <p>We'll review your details and offer you a competitive price</p>
                </div>
              </div>
              <div className="sale-me-your-phone-step">
                <div className="sale-me-your-phone-step-number">3</div>
                <div className="sale-me-your-phone-step-text">
                  <h3>Ship Your Phone</h3>
                  <p>Send us your phone using our prepaid shipping label</p>
                </div>
              </div>
              <div className="sale-me-your-phone-step">
                <div className="sale-me-your-phone-step-number">4</div>
                <div className="sale-me-your-phone-step-text">
                  <h3>Get Paid</h3>
                  <p>Receive payment via PayPal, bank transfer, or store credit</p>
                </div>
              </div>
            </div>
          </div>

          <form className="sale-me-your-phone-form" onSubmit={handleSubmit}>
            <h2>Phone Details</h2>
            
            {/* Submit Message */}
            {displayMessage && (
              <div className={`submit-message ${displayMessage.type}`}>
                {displayMessage.message}
              </div>
            )}
            
            <div className="sale-me-your-phone-form-group">
              <label htmlFor="brand">Brand *</label>
              <select 
                id="brand" 
                name="brand" 
                value={phoneDetails.brand} 
                onChange={handleInputChange}
                required
                disabled={submitLoading}
              >
                <option value="">Select Brand</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="google">Google</option>
                <option value="oneplus">OnePlus</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="huawei">Huawei</option>
                <option value="oppo">Oppo</option>
                <option value="vivo">Vivo</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="model">Model *</label>
              <input 
                type="text" 
                id="model" 
                name="model" 
                value={phoneDetails.model} 
                onChange={handleInputChange}
                placeholder="e.g. iPhone 13 Pro, Galaxy S21"
                required
                disabled={submitLoading}
              />
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="condition">Condition *</label>
              <select 
                id="condition" 
                name="condition" 
                value={phoneDetails.condition} 
                onChange={handleInputChange}
                required
                disabled={submitLoading}
              >
                <option value="excellent">Excellent - Like New</option>
                <option value="good">Good - Minor Scratches</option>
                <option value="fair">Fair - Visible Wear</option>
                <option value="poor">Poor - Significant Damage</option>
              </select>
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="storage">Storage Capacity *</label>
              <select 
                id="storage" 
                name="storage" 
                value={phoneDetails.storage} 
                onChange={handleInputChange}
                required
                disabled={submitLoading}
              >
                <option value="">Select Storage</option>
                <option value="16">16GB</option>
                <option value="32">32GB</option>
                <option value="64">64GB</option>
                <option value="128">128GB</option>
                <option value="256">256GB</option>
                <option value="512">512GB</option>
                <option value="1024">1TB</option>
              </select>
            </div>

            {/* Added Color Field */}
            <div className="sale-me-your-phone-form-group">
              <label htmlFor="color">Color *</label>
              <select 
                id="color" 
                name="color" 
                value={phoneDetails.color} 
                onChange={handleInputChange}
                required
                disabled={submitLoading}
              >
                <option value="">Select Color</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="rose-gold">Rose Gold</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="pink">Pink</option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Added Expected Price Field */}
            <div className="sale-me-your-phone-form-group">
              <label htmlFor="expectedPrice">Expected Price ($) *</label>
              <input 
                type="number" 
                id="expectedPrice" 
                name="expectedPrice" 
                value={phoneDetails.expectedPrice} 
                onChange={handleInputChange}
                placeholder="e.g. 500"
                min="1"
                step="0.01"
                required
                disabled={submitLoading}
              />
              <small>Enter the price you expect to receive for your phone</small>
            </div>

            <div className="sale-me-your-phone-form-group">
              <label className="sale-me-your-phone-checkbox-label">
                <input 
                  type="checkbox" 
                  name="hasCharger" 
                  checked={phoneDetails.hasCharger} 
                  onChange={handleInputChange}
                  disabled={submitLoading}
                />
                Includes original charger
              </label>
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="phoneImage">Upload Phone Image</label>
              <input 
                type="file" 
                id="phoneImage" 
                name="phoneImage" 
                accept="image/*" 
                onChange={handleImageChange}
                disabled={submitLoading}
              />
              <small>Max file size: 5MB. Supported formats: JPEG, PNG, GIF</small>
              {previewImage && (
                <div className="sale-me-your-phone-image-preview">
                  <img src={previewImage} alt="Phone preview" />
                </div>
              )}
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="description">Additional Details</label>
              <textarea 
                id="description" 
                name="description" 
                value={phoneDetails.description} 
                onChange={handleInputChange}
                placeholder="Tell us more about your phone's condition, included accessories, etc."
                rows="4"
                disabled={submitLoading}
              />
            </div>

            <h2>Contact Information</h2>
            
            <div className="sale-me-your-phone-form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={phoneDetails.fullName} 
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={submitLoading}
              />
            </div>
            
            <div className="sale-me-your-phone-form-group">
              <label htmlFor="contactEmail">Email *</label>
              <input 
                type="email" 
                id="contactEmail" 
                name="contactEmail" 
                value={phoneDetails.contactEmail} 
                onChange={handleInputChange}
                required
                disabled={submitLoading}
              />
            </div>

            <div className="sale-me-your-phone-form-group">
              <label htmlFor="contactPhone">Phone Number *</label>
              <input 
                type="tel" 
                id="contactPhone" 
                name="contactPhone" 
                value={phoneDetails.contactPhone} 
                onChange={handleInputChange}
                placeholder="+1-555-123-4567"
                required
                disabled={submitLoading}
              />
            </div>

            <button 
              type="submit" 
              className="sale-me-your-phone-submit-btn"
              disabled={submitLoading}
            >
              {submitLoading ? 'Submitting...' : 'Get Quote'}
            </button>
          </form>
        </div>

        <div className="sale-me-your-phone-testimonials">
          <h2>What Our Customers Say</h2>
          <div className="sale-me-your-phone-testimonial-container">
            <div className="sale-me-your-phone-testimonial">
              <p>"The process was quick and easy. I got a fair price for my old iPhone and the money was in my account within 48 hours!"</p>
              <span className="sale-me-your-phone-testimonial-author">- Sarah T.</span>
            </div>
            <div className="sale-me-your-phone-testimonial">
              <p>"I was skeptical at first, but the quote they gave me was higher than other sites. Very satisfied with the service!"</p>
              <span className="sale-me-your-phone-testimonial-author">- Mike R.</span>
            </div>
            <div className="sale-me-your-phone-testimonial">
              <p>"The shipping label made it so convenient. I just packed up my phone and dropped it off. Got paid exactly what they quoted!"</p>
              <span className="sale-me-your-phone-testimonial-author">- Jessica L.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellYourPhone;