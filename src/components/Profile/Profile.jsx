import React from 'react'
import './Profile.css'
import mizan from '../../assets/mizan.jpg';


const Profile = () => {

  return (
    <div className="profile-details-container">
    <div className="profile-details-card">
      <img
        src={mizan}
        alt='profile'
        className="profile-details-avatar"
      />
      <h2 className="profile-details-full-name">
        Paskal Khadka
      </h2>
      <p className="profile-details-username">
        @paskal_khadka
      </p>
      <div className="profile-details-info">
        <table>
          <tbody>
            <tr>
              <td><strong>Email:</strong></td>
              <td>@gmail.com</td>
            </tr>
            <tr>
              <td><strong>Location:</strong></td>
              <td>sivapuri dada</td>
            </tr>
            <tr>
              <td><strong>DOB:</strong></td>
              <td>2003-05-18</td>
            </tr>
            <tr>
              <td><strong>Gender:</strong></td>
              <td>Male</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>9863982722</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default Profile
