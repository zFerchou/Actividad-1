import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles si se especifican
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.rol);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;