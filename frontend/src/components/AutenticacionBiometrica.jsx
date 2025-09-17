import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AutenticacionBiometrica.css';

const AutenticacionBiometrica = () => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleMetodoSeleccion = (metodo) => {
    setMetodoSeleccionado(metodo);
  };

  const autenticar = () => {
    localStorage.setItem('autenticado', 'true');
    alert('Autenticación exitosa!');
    navigate('/perfil'); // Redirige al perfil
  };

  const verificarPin = () => {
    if (pin === '1234') {
      autenticar();
    } else {
      alert('PIN incorrecto');
    }
  };

  const simularHuellaDigital = () => {
    setTimeout(autenticar, 1000);
  };

  const simularReconocimientoFacial = () => {
    setTimeout(autenticar, 1500);
  };

  return (
    <div className="autenticacion-container">
      <h2>Autenticación Biométrica</h2>
      <div className="metodos-autenticacion">
        <h3>Selecciona tu método:</h3>
        <button onClick={() => handleMetodoSeleccion('huella')}>📋 Huella Digital</button>
        <button onClick={() => handleMetodoSeleccion('facial')}>📷 Reconocimiento Facial</button>
        <button onClick={() => handleMetodoSeleccion('pin')}>🔒 PIN</button>

        {metodoSeleccionado === 'pin' && (
          <div>
            <input
              type="password"
              placeholder="Ingresa tu PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
            <button onClick={verificarPin}>Verificar PIN</button>
          </div>
        )}

        {metodoSeleccionado === 'huella' && (
          <div>
            <p>Coloca tu dedo...</p>
            <button onClick={simularHuellaDigital}>Simular Huella</button>
          </div>
        )}

        {metodoSeleccionado === 'facial' && (
          <div>
            <p>Mira a la cámara...</p>
            <button onClick={simularReconocimientoFacial}>Simular Reconocimiento Facial</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutenticacionBiometrica;
