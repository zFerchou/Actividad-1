import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children, requiredRoles = [], requireBiometric = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.rol);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Verificación de biometría
  if (requireBiometric) {
    const biometricPassed = localStorage.getItem('autenticado') === 'true';
    if (!biometricPassed) {
      return <Navigate to="/autenticacion" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
