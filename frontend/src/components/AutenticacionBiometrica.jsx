import React, { useState } from 'react';
import '../styles/AutenticacionBiometrica.css';

const AutenticacionBiometrica = () => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [pin, setPin] = useState('');

  const handleMetodoSeleccion = (metodo) => {
    setMetodoSeleccionado(metodo);
    setEstaAutenticado(false);
  };

 
const verificarPin = () => {
  if (pin === '1234') {
    setEstaAutenticado(true);
    localStorage.setItem('autenticado', 'true');
    alert('Autenticación exitosa!');
  } else {
    alert('PIN incorrecto');
  }
};

const simularHuellaDigital = () => {
  setTimeout(() => {
    setEstaAutenticado(true);
    localStorage.setItem('autenticado', 'true');
    alert('Huella digital verificada exitosamente!');
  }, 1000);
};

const simularReconocimientoFacial = () => {
  setTimeout(() => {
    setEstaAutenticado(true);
    localStorage.setItem('autenticado', 'true');
    alert('Reconocimiento facial exitoso!');
  }, 1500);
};

  return (
    <div className="autenticacion-container">
      <h2>Autenticación Biométrica</h2>
      
      {!estaAutenticado ? (
        <div className="metodos-autenticacion">
          <h3>Selecciona tu método de autenticación:</h3>
          
          <div className="botones-metodos">
            <button 
              onClick={() => handleMetodoSeleccion('huella')}
              className="boton-metodo"
            >
              📋 Huella Digital
            </button>
            
            <button 
              onClick={() => handleMetodoSeleccion('facial')}
              className="boton-metodo"
            >
              📷 Reconocimiento Facial
            </button>
            
            <button 
              onClick={() => handleMetodoSeleccion('pin')}
              className="boton-metodo"
            >
              🔒 PIN
            </button>
          </div>

          {metodoSeleccionado === 'pin' && (
            <div className="pin-container">
              <input
                type="password"
                placeholder="Ingresa tu PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength="4"
              />
              <button onClick={verificarPin}>Verificar PIN</button>
            </div>
          )}

          {metodoSeleccionado === 'huella' && (
            <div className="simulacion-container">
              <p>Coloca tu dedo en el sensor...</p>
              <button onClick={simularHuellaDigital}>Simular Huella</button>
            </div>
          )}

          {metodoSeleccionado === 'facial' && (
            <div className="simulacion-container">
              <p>Mira hacia la cámara...</p>
              <button onClick={simularReconocimientoFacial}>Simular Reconocimiento Facial</button>
            </div>
          )}
        </div>
      ) : (
        <div className="autenticacion-exitosa">
          <h3>✅ Autenticación Exitosa</h3>
          <p>Ahora puedes acceder a tu información personal de manera segura.</p>
          <button onClick={() => setEstaAutenticado(false)}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
};



export default AutenticacionBiometrica;