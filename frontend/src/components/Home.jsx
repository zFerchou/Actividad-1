import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-header">
        <h1> Sistema de Gestión Segura</h1>
        <p>Bienvenido al sistema protegido con autenticación biométrica</p>
      </div>

      <div className="home-cards">
        <div className="home-card" onClick={() => navigate('/navigation')}>
          <div className="card-icon">👤</div>
          <h3>Mi Perfil </h3>
          <p>Gestiona y modifica tu información personal de manera segura</p>
          <button className="card-button">Acceder</button>
        </div>

        <div className="home-card" onClick={() => navigate('/usuarios')}>
          <div className="card-icon">👥</div>
          <h3>Gestión de Usuarios</h3>
          <p>Administra los usuarios del sistema (requiere permisos)</p>
          <button className="card-button">Acceder</button>
        </div>

        
      </div>

      <div className="home-footer">
        <p>Sistema protegido con tecnología de autenticación avanzada</p>
      </div>
    </div>
  );
};

export default Home;