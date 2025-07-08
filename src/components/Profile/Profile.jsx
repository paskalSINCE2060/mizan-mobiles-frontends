// Updated Profile.jsx - Email and Phone fields disabled in edit mode

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
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Update form data when user changes in Redux store
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      console.log('User data from Redux:', user);
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || user.number || "",
        // Format date properly for input field
        dateOfBirth: user.dateOfBirth ? 
          (user.dateOfBirth.includes('T') ? 
            user.dateOfBirth.split('T')[0] : user.dateOfBirth) : "",
        location: user.location || "",
        bio: user.bio || "",
        gender: user.gender || ""      });
    }
  }, [isAuthenticated, user, navigate]);

  // Helper function to generate username safely
  const generateUsername = (fullName) => {
    if (!fullName) return "user";
    return fullName.replace(/\s+/g, "_").toLowerCase();
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
      
      // IMPORTANT: Don't send email and phone in the update request
      // since they should remain unchanged from signup
      const cleanedFormData = {
        fullName: formData.fullName?.trim() || "",
        // Remove email and phone from update payload
        // email: formData.email?.trim() || "",
        // phone: formData.phone?.trim() || "",
        dateOfBirth: formData.dateOfBirth?.trim() || "",
        location: formData.location?.trim() || "",
        bio: formData.bio?.trim() || "",
        gender: formData.gender?.trim() || ""
            };

      console.log('Cleaned form data being sent:', cleanedFormData);
      
      // API call to update profile
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedFormData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile update response:', updatedUser);
        
        // Update Redux store with the complete updated user data
        dispatch(updateUserProfile(updatedUser));
        
        setIsEditing(false);
        setMessage("Profile updated successfully!");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
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
            {!isEditing && (
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
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
                  value={formData.fullName}
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
                  value={formData.email}
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
                  value={formData.phone}
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
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
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
                  value={formData.bio}
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
                    <td>{user.dateOfBirth ? 
                      (user.dateOfBirth.includes('T') ? 
                        new Date(user.dateOfBirth).toLocaleDateString() : user.dateOfBirth) 
                      : "Not provided"}</td>
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