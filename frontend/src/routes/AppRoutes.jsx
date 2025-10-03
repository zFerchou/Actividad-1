
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import NotificacionScreen from '../components/NotificacionScreen';
import Login from '../components/Login';
import Usuarios from '../components/Usuarios';
import PerfilSeguro from '../components/PerfilSeguro';
import AutenticacionBiometrica from '../components/AutenticacionBiometrica';
import ProtectedRoute from '../routes/ProtectedRoute';
import Unauthorized from '../components/Unauthorized';
import ForgotUsername from '../components/ForgotUsername';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';

import UsuariosOffline from '../components/UsuariosOffline';
import PerfilSeguroOffline from '../components/PerfilSeguroOffline';
import authService from '../services/auth';
import Geolocalizacion from '../components/Geolocalizacion';


const AppRoutes = () => {
  return (
    <Routes>

      {/* Pantalla de notificaciones */}
      <Route path="/notificaciones" element={
        <ProtectedRoute>
          <NotificacionScreen />
        </ProtectedRoute>
      } />

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
      {/* Acceso a perfil en modo offline (pre-login) */}
      <Route path="/perfil-offline" element={
        authService.canLoginOffline() ? <PerfilSeguroOffline /> : <Navigate to="/login" replace />
      } />
      
      {/* Nuevas rutas de recuperación */}
      <Route path="/forgot-username" element={<ForgotUsername />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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
      <Route path="/geolocalizacion" element={
        <ProtectedRoute>
          <Geolocalizacion />
        </ProtectedRoute>
      } />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
  );
};

export default AppRoutes;