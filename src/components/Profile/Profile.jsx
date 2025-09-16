// Updated Profile.jsx - Added "Your Orders" button

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../slice/authSlice";
import "./Profile.css";
import mizan from "../../assets/mizan.jpg";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user data and token from Redux store
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // Backend URL - change this to your actual backend URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mizan-mobile-backend-mizan.up.railway.app';

  // Update form data when user changes in Redux store
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      console.log('User data from Redux:', user);
      const initialFormData = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || user.number || "",
        dateOfBirth: user.dateOfBirth ? 
          (user.dateOfBirth.includes('T') ? 
            user.dateOfBirth.split('T')[0] : user.dateOfBirth) : "",
        location: user.location || "",
        bio: user.bio || "",
        gender: user.gender || ""
      };
      setFormData(initialFormData);
    }
  }, [isAuthenticated, user, navigate]);

    useEffect(() => {
    console.log('=== PROFILE DEBUG ===');
    console.log('Redux user:', user);
    console.log('localStorage user:', JSON.parse(localStorage.getItem('loggedInUser') || '{}'));
    console.log('Current formData:', formData);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('token:', token);
    console.log('========================');
  }, [user, formData, isAuthenticated, token]);

  // Helper function to generate username safely
  const generateUsername = (fullName) => {
    if (!fullName) return "user";
    return fullName.replace(/\s+/g, "_").toLowerCase();
  };

  // Handle navigation to orders page
  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Please select a valid image file (JPEG, PNG, or GIF)");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage("Image size must be less than 5MB");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setImageLoading(true);
    setMessage("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('profileImage', file);

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id || user._id}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Image upload result:', result);
        
        // Update user data in Redux store with the new profile image
        const updatedUser = { ...user, profileImage: result.profileImage };
        dispatch(updateUserProfile(updatedUser));
        
        // IMPORTANT: Also update localStorage to persist the change
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        
        setMessage("Profile image updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage("Error uploading image. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setImageLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log('Submitting form data:', formData);
      
      // Validate required fields
      if (!formData.fullName || formData.fullName.trim() === '') {
        throw new Error('Full name is required');
      }

      // Prepare data for API call - only send the fields that can be updated
      const updatePayload = {
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth || "",
        location: formData.location || "",
        bio: formData.bio || "",
        gender: formData.gender || ""
      };

      console.log('Update payload being sent:', updatePayload);
      
      // API call to update profile
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      const responseData = await response.json();
      console.log('API response:', responseData);

      if (response.ok) {
        console.log('Profile update successful:', responseData);
        
        // CRITICAL FIX: Create the complete updated user object
        const updatedUser = {
          ...user, // Keep all existing user data
          ...responseData, // Apply the updates from the response
          // Explicitly preserve critical fields that shouldn't change
          id: user.id || user._id,
          _id: user._id || user.id,
          email: user.email, // Email should never change
          phone: user.phone || user.number, // Phone should never change
          profileImage: user.profileImage // Keep existing profile image
        };
        
        console.log('Complete updated user object:', updatedUser);
        
        // Update Redux store
        dispatch(updateUserProfile(updatedUser));
        
        // CRITICAL FIX: Update localStorage immediately to persist changes
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        
        // Update local form data to reflect the changes
        setFormData(prev => ({
          ...prev,
          fullName: updatedUser.fullName,
          dateOfBirth: updatedUser.dateOfBirth ? 
            (updatedUser.dateOfBirth.includes('T') ? 
              updatedUser.dateOfBirth.split('T')[0] : updatedUser.dateOfBirth) : "",
          location: updatedUser.location || "",
          bio: updatedUser.bio || "",
          gender: updatedUser.gender || ""
        }));
        
        setIsEditing(false);
        setMessage("Profile updated successfully!");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.error('Update failed:', responseData);
        throw new Error(responseData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.message || "Error updating profile. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || user.number || "",
      dateOfBirth: user.dateOfBirth ? 
        (user.dateOfBirth.includes('T') ? 
          user.dateOfBirth.split('T')[0] : user.dateOfBirth) : "",
      location: user.location || "",
      bio: user.bio || "",
      gender: user.gender || ""
    });
    setIsEditing(false);
    setMessage("");
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not provided";
    
    try {
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString();
      }
      return dateString;
    } catch (error) {
      return "Invalid date";
    }
  };

  // Debug: Log current user state
  console.log('Current user from Redux:', user);
  console.log('Current form data:', formData);

  return user ? (
    <div className="profile-details-container">
      <div className="profile-details-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img 
              src={user.profileImage ? `${API_BASE_URL}${user.profileImage}` : mizan} 
              alt="profile" 
              className="profile-details-avatar"
              key={user.profileImage || 'default'}
            />
            <div className="image-overlay">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="imageUpload" 
                className="change-image-btn"
                title="Change profile image"
              >
                {imageLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                )}
              </label>
            </div>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-details-full-name">
              {user.fullName || "User"}
            </h2>
            <p className="profile-details-username">
              @{generateUsername(user.fullName)}
            </p>
            <div className="profile-action-buttons">
              {!isEditing && (
                <>
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
                    className="orders-btn"
                    onClick={handleViewOrders}
                    title="View your order history"
                  >
                    📦 Your Orders
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${message.includes('Error') || message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Profile Content */}
        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* DISABLED EMAIL FIELD */}
              <div className="form-group">
                <label htmlFor="email">Email * (Cannot be changed)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  disabled
                  className="disabled-field"
                  title="Email cannot be changed after signup"
                />
                <small className="field-note">Email is set during signup and cannot be modified</small>
              </div>

              {/* DISABLED PHONE FIELD */}
              <div className="form-group">
                <label htmlFor="phone">Phone * (Cannot be changed)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  disabled
                  className="disabled-field"
                  title="Phone number cannot be changed after signup"
                />
                <small className="field-note">Phone number is set during signup and cannot be modified</small>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="profile-details-info">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <table>
                <tbody>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{user.email || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{user.phone || user.number || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td><strong>Date of Birth:</strong></td>
                    <td>{formatDateForDisplay(user.dateOfBirth)}</td>
                  </tr>
                  <tr>
                    <td><strong>Location:</strong></td>
                    <td>{user.location || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td><strong>Gender:</strong></td>
                    <td>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not provided"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {user.bio && (
              <div className="profile-section">
                <h3>About Me</h3>
                <p className="bio-text">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Profile;