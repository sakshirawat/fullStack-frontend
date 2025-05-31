// src/components/ProtectedRoute.jsx

import React from 'react';
// Import Navigate component from react-router-dom to programmatically redirect users
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component restricts access to its children components
 * based on user authentication status.
 * 
 * @param {React.ReactNode} children - The components or elements to render if authenticated.
 * @returns {React.ReactNode} - The children if authenticated, otherwise a redirect to "/signin".
 */
const ProtectedRoute = ({ children }) => {
  // Retrieve JWT token or authentication token from localStorage
  // This token typically indicates user is logged in
  const token = localStorage.getItem('token');

  // If token exists (user is authenticated), render the protected components (children)
  // Otherwise, redirect the user to the "/signin" route to log in
  return token ? children : <Navigate to="/signin" />;
};

// Export ProtectedRoute as default export to use in other parts of app
export default ProtectedRoute;
