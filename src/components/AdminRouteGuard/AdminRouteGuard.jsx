import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminRouteGuard = ({ children }) => {
  const location = useLocation();
  const toastShown = useRef(false);
  
  // Get user data from Redux store instead of props
  const { user } = useSelector((state) => state.auth);
  
  // Also check localStorage as fallback
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const userData = user || storedUser;

  useEffect(() => {
    // Show toast when user exists but is not admin
    if (userData && userData.role !== "admin" && !toastShown.current) {
      toast.error(" You don't have permission to access this page.");
      toastShown.current = true;
    }
  }, [userData]);

  // If no user data, redirect to login
  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not admin, show toast and redirect to home
  if (userData.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRouteGuard;