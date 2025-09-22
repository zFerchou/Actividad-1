import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';
import '../styles/AuthForms.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.verifyToken(token);
        setValidToken(true);
      } catch (err) {
        setValidToken(false);
        setError(err?.toString() || 'El enlace de recuperación es inválido o ha expirado.');
      }
    };

    if (token) verifyToken();
    else {
      setValidToken(false);
      setError('Token no proporcionado');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword(token, newPassword);
      setMessage(response.message || 'Contraseña restablecida con éxito');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.toString() || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Enlace Inválido</h2>
            <p>{error}</p>
          </div>

          <div className="auth-links">
            <Link to="/forgot-password" className="btn btn-primary">Solicitar nuevo enlace</Link>
            <Link to="/login" className="link">Volver al Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Restablecer Contraseña</h2>
          <p>Crea una nueva contraseña para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="link">← Volver al Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
