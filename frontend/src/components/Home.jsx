import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Notificaciones from './Notificaciones';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const online = useOnlineStatus();

  return (
    <div className="home-container">


      <div className="home-header">
        <h1> Sistema de Gestión Segura</h1>
        <p>Bienvenido al sistema protegido con autenticación biométrica</p>
      </div>

      {!online && (
        <div style={{color:'orange', marginBottom: 16, fontWeight: 'bold'}}>
          Estás en modo solo lectura. No puedes acceder a las funciones protegidas sin conexión.
        </div>
      )}

      <div className="home-cards">
        <div className="home-card" onClick={online ? () => navigate('/perfil') : undefined} style={!online ? {opacity:0.6, pointerEvents:'none'} : {}}>
          <div className="card-icon">👤</div>
          <h3>Mi Perfil </h3>
          <p>Gestiona y modifica tu información personal de manera segura</p>
          <button className="card-button" disabled={!online}>Acceder</button>
        </div>

        <div className="home-card" onClick={online ? () => navigate('/usuarios') : undefined} style={!online ? {opacity:0.6, pointerEvents:'none'} : {}}>
          <div className="card-icon">👥</div>
          <h3>Gestión de Usuarios</h3>
          <p>Administra los usuarios del sistema (requiere permisos)</p>
          <button className="card-button" disabled={!online}>Acceder</button>
        </div>
      </div>

      <div className="home-footer">
        <p>Sistema protegido con tecnología de autenticación avanzada</p>
      </div>
    </div>
  );
};

export default Home;