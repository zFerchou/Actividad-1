import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Usuarios from '../components/Usuarios';
import PerfilSeguro from '../components/PerfilSeguro';
import PerfilSeguroOffline from '../components/PerfilSeguroOffline';
import AutenticacionBiometrica from '../components/AutenticacionBiometrica';
import ProtectedRoute from '../routes/ProtectedRoute';
import Unauthorized from '../components/Unauthorized';
import UsuariosOffline from '../components/UsuariosOffline';


const AppRoutes = () => {
  return (
    <Routes>

      {/* Rutas para usuarios offline */}
      <Route path="/usuarios-offline" element={
      <ProtectedRoute>
       <UsuariosOffline />
      </ProtectedRoute>
      } />
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/autenticacion" element={<AutenticacionBiometrica />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute requiredRoles={['admin']}>
          <Usuarios />
        </ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute requireBiometric={true}>
          <PerfilSeguro />
        </ProtectedRoute>
      } />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
  );
};

export default AppRoutes;
