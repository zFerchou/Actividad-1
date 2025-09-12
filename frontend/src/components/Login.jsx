import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import authService from '../services/auth';
import '../styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      console.log('Intentando login con:', credentials);
      const data = await authAPI.login(credentials);
      console.log('Login exitoso:', data);
      
      // Guardar datos de autenticación
      authService.setAuthData(data.token, data.user);
      
      navigate('/');
    } catch (err) {
      console.error('Error en login:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.');
      } else if (err.message.includes('404')) {
        setError('Endpoint no encontrado. Verifica la URL de la API.');
      } else if (err.message.includes('401')) {
        setError('Credenciales incorrectas');
      } else {
        setError(err.message || 'Error en el login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Datos de prueba para desarrollo
  const fillTestCredentials = (type) => {
    if (type === 'admin') {
      setCredentials({
        email: 'admin@example.com',
        password: 'password123'
      });
    } else if (type === 'user') {
      setCredentials({
        email: 'usuario@example.com',
        password: 'password123'
      });
    }
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🔐 Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="tu.email@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Tu contraseña"
              minLength="6"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        {/* Solo mostrar en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="test-credentials">
            <h4>Credenciales de prueba (solo desarrollo):</h4>
            <div className="test-buttons">
              <button 
                type="button" 
                onClick={() => fillTestCredentials('admin')}
                className="test-btn"
              >
                Llenar Admin
              </button>
              <button 
                type="button" 
                onClick={() => fillTestCredentials('user')}
                className="test-btn"
              >
                Llenar Usuario
              </button>
            </div>
          </div>
        )}

        <div className="login-footer">
          <p>¿No tienes cuenta? <span className="link">Contacta al administrador</span></p>
          <p>¿Olvidaste tu contraseña? <span className="link">Recuperar acceso</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;