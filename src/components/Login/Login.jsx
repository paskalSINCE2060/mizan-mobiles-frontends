import React from 'react'
import './Login.css'

const Login = () => {
  return (
    <>
    <div class="login-page-main-container">
        <div class="Login-page login-container">
            <h2>Welcome Back!</h2>
            <p>Log in to continue</p>
            <form>
                <div class="Login-page input-group">
                    <input type="email" placeholder="Email" required />
                </div>
                <div class="Login-page input-group">
                    <input type="password" placeholder="Password" required />
                </div>
                <button type="submit" class="Login-page login-button">Login</button>
                <a href="/forgetpassword" class="Login-page forgot-password">Forgot Password?</a>
            </form>
            <p class="Login-page signup-text">Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    </div>
    </>
  )
}

export default Login
