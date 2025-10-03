// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const ProtectedRoute = ({ children, requiredRoles = [], requireBiometric = false }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const tokenValid = authService.isTokenValid();

  // 1️⃣ Verificar autenticación
  if (!isAuthenticated || !user || !tokenValid) {
    authService.logout(); // Asegura limpieza de sesión si algo falla
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Verificación de roles
  if (requiredRoles.length > 0) {
    const hasRole = requiredRoles.includes(user.rol);
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3️⃣ Verificación de biometría
  if (requireBiometric) {
    const biometricPassed = localStorage.getItem('autenticado') === 'true';
    if (!biometricPassed) {
      return <Navigate to="/autenticacion" replace />;
    }
  }

  // 4️⃣ Todo correcto, renderizar hijos
  return children;
};

export default ProtectedRoute;
