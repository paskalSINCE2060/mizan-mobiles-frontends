import React from 'react'
import './Signup.css'

const Signup = () => {
  return (
    <>
       <div class="Signup-page signup-container">
        <h2>Create an Account</h2>
        <p>Join us today!</p>
        <form>
            <div class="Signup-page input-group">
                <input type="text" placeholder="Full Name" required/>
            </div>
            <div class="Signup-page input-group">
                <input type="email" placeholder="Email" required/>
            </div>
            <div class="Signup-page input-group">
                <input type="password" placeholder="Password" required/>
            </div>
            <div class="Signup-page input-group">
                <input type="password" placeholder="Confirm Password" required/>
            </div>
            <button type="submit" class="Signup-page signup-button">Sign Up</button>
            <p class="Signup-page login-text">Already have an account? <a href="/login">Login</a></p>
        </form>
    </div>
    </>
  )
}

export default Signup
