import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return null; // No mostrar navegación si no hay usuario logueado
  }

  return (
    <nav className="navigation">
      <div className="nav-brand" onClick={() => navigate('/')}>
        🛡️ Sistema Seguro
      </div>
      
      <div className="nav-links">
        <button 
          className={isActive('/') ? 'nav-link active' : 'nav-link'}
          onClick={() => navigate('/')}
        >
          🏠 Inicio
        </button>
        <button 
          className={isActive('/perfil') ? 'nav-link active' : 'nav-link'}
          onClick={() => navigate('/perfil')}
        >
          👤 Perfil
        </button>
        
        {authService.hasRole('admin') && (
          <button 
            className={isActive('/usuarios') ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('/usuarios')}
          >
            👥 Usuarios
          </button>
        )}
        
        <button 
          className={isActive('/autenticacion') ? 'nav-link active' : 'nav-link'}
          onClick={() => navigate('/autenticacion')}
        >
          🔐 Autenticación
        </button>
      </div>

      <div className="nav-user">
        <span>👋 Hola, {user.nombre}</span>
        <span className="user-role">({user.rol})</span>
        <button onClick={handleLogout} className="logout-button">
          🚪 Salir
        </button>
      </div>
    </nav>
  );
};

export default Navigation;