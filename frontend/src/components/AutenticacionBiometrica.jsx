import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AutenticacionBiometrica.css';

const AutenticacionBiometrica = () => {
  const [pin, setPin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos la contraseña del usuario logueado desde localStorage
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
      setUserPassword(user.password);
    }
  }, []);

  const autenticar = () => {
    localStorage.setItem('autenticado', 'true');
    alert('Autenticación exitosa!');
    navigate('/perfil'); // Redirige al perfil
  };

  const verificarPin = () => {
    if (pin === userPassword) {
      autenticar();
    } else {
      alert('PIN incorrecto');
    }
  };

  return (
    <div className="autenticacion-container">a
      <h2>Autenticación con PIN</h2>
      <div className="pin-container">
        <input
          type="password"
          placeholder="Ingresa tu PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="btn-pin" onClick={verificarPin}>
          Verificar PIN
        </button>
      </div>
    </div>
  );
};

export default AutenticacionBiometrica;
