import React from 'react'
import './ForgetPassword.css'

const ForgetPassword = () => {
  return (
    <>
      <div class="foreget-password-page password-container">
        <h2>Reset Password</h2>
        <p>Enter your email to reset your password</p>
        <form>
            <div class="foreget-password-page input-group">
                <input type="email" placeholder="Email" required />
            </div>
            <button type="submit" class="foreget-password-page reset-button">Send Reset Link</button>
            <p class="foreget-password-page back-text">
                Remember your password? <a href="/login">Login</a>
            </p>
        </form>
    </div>
    </>
  )
}

export default ForgetPassword
