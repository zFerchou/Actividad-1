import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Agregar Link
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
    setError(''); 
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta? 
            <span className="link"> Contacta al administrador</span>
          </p>
          
          {/* ENLACES DE RECUPERACIÓN - CORREGIDOS */}
          <div className="recovery-links">
            <Link to="/forgot-username" className="link">
              ¿Olvidaste tu nombre de usuario?
            </Link>
            <Link to="/forgot-password" className="link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;