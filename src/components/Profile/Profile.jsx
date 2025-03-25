import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import mizan from "../../assets/mizan.jpg";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login"); // Redirect to login if no user
    } else {
      setUserData(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove logged-in user from localStorage
    localStorage.removeItem("loggedInUser");
    
    // Optional: Clear other related local storage items if needed
    // localStorage.removeItem("userData");

    // Redirect to login page
    navigate("/login");
  };

  return userData ? (
    <div className="profile-details-container">
      <div className="profile-details-card">
        <img src={mizan} alt="profile" className="profile-details-avatar" />
        <h2 className="profile-details-full-name">{userData.fullName}</h2>
        <p className="profile-details-username">
          @{userData.fullName.replace(" ", "_").toLowerCase()}
        </p>
        <div className="profile-details-info">
          <table>
            <tbody>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{userData.email}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{userData.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
};

export default Profile;