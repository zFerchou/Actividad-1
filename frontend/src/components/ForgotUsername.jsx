// src/components/ForgotUsername.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/AuthForms.css';

const ForgotUsername = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.forgotUsername(email);
      setMessage(response.message);
    } catch (err) {
      // Evita pasar objetos completos a React
      setError(err?.response?.data?.message || err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Recuperar Nombre de Usuario</h2>
          <p>Te enviaremos tu nombre de usuario por correo electrónico</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu correo electrónico registrado"
              disabled={loading}
            />
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Enviando...' : 'Recuperar Usuario'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="link">← Volver al Login</Link>
          <Link to="/forgot-password" className="link">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotUsername;
