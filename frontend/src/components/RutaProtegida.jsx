import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  // Verificar si el usuario ha completado la autenticación biométrica
  const estaAutenticado = localStorage.getItem('autenticado') === 'true';

  if (!estaAutenticado) {
    // Si no está autenticado, redirige al componente de autenticación
    return <Navigate to="/autenticacion" replace />;
  }

  // Si está autenticado, renderiza los hijos (PerfilSeguro)
  return children;
};

export default RutaProtegida;
