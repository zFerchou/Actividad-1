import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AutenticacionBiometrica.css';

const AutenticacionBiometrica = () => {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const autenticar = () => {
    localStorage.setItem('autenticado', 'true');
    alert('¡Autenticación exitosa!');
    navigate('/perfil');
  };

  const verificarPin = () => {
    const storedPassword = localStorage.getItem('password'); // guardada en el login
    if (pin === storedPassword) {
      autenticar();
    } else {
      alert('❌ PIN incorrecto');
    }
  };

  return (
    <div className="autenticacion-container">
      <div className="auth-card">
        <h2>Autenticación por PIN</h2>
        <p>Ingresa tu contraseña como PIN para continuar</p>
        <input
          type="password"
          placeholder="Ingresa tu PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="pin-input"
        />
        <button className="btn-verificar" onClick={verificarPin}>
          Verificar PIN
        </button>
      </div>
    </div>
  );
};

export default AutenticacionBiometrica;
