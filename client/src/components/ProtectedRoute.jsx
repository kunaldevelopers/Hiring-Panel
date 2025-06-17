import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, type }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) {
    // If no token, redirect to appropriate login page
    return (
      <Navigate to={type === "admin" ? "/admin/login" : "/login"} replace />
    );
  }

  if (type && userType !== type) {
    // If user type doesn't match required type, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
