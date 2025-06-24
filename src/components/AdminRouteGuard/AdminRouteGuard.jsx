import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminRouteGuard = ({ children }) => {
  const location = useLocation();
  const toastShown = useRef(false);
  
  // Get user data from Redux store instead of props
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Also check localStorage as fallback
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const userData = user || storedUser;

  // DEBUG LOGS - Add these to see what's happening
  console.log("=== AdminRouteGuard Debug ===");
  console.log("Redux user:", user);
  console.log("Redux isAuthenticated:", isAuthenticated);
  console.log("Stored user:", storedUser);
  console.log("Final userData:", userData);
  console.log("User role:", userData?.role);
  console.log("Is admin?", userData?.role === "admin");
  console.log("=============================");

  useEffect(() => {
    // Show toast when user exists but is not admin
    if (userData && userData.role !== "admin" && !toastShown.current) {
      console.log("Showing admin access denied toast");
      toast.error("You don't have permission to access this page.");
      toastShown.current = true;
    }
  }, [userData]);

  // If no user data, redirect to login
  if (!userData) {
    console.log("No user data found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not admin, show toast and redirect to home
  if (userData.role !== "admin") {
    console.log(`User role is '${userData.role}', not 'admin'. Redirecting to home.`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log("Admin access granted!");
  return children;
};

export default AdminRouteGuard;