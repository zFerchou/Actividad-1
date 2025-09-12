import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1>Acceso No Autorizado</h1>
        <p>No tienes permisos suficientes para acceder a esta página.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;