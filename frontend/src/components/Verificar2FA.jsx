
import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './styles/Verificar2FA.css';

const Verificar2FA = ({ email, onSuccess, onError }) => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
  const data = await authAPI.verify2FA({ email, codigo });
      if (data.success && data.token) {
        onSuccess(data);
      } else {
        setError(data.error || 'Código incorrecto');
        if (onError) onError(data.error);
      }
    } catch (err) {
      setError(err.message || 'Error de red o servidor');
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verificar-2fa-container">
      <h2>Verificación en dos pasos</h2>
      <p>Se ha enviado un código temporal a <b>{email}</b>. Ingrésalo para continuar.</p>
      <form onSubmit={handleSubmit} className="verificar-2fa-form">
        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          placeholder="Código de 6 dígitos"
          value={codigo}
          onChange={e => setCodigo(e.target.value.replace(/[^0-9]/g, ''))}
          required
          autoFocus
        />
        <button type="submit" disabled={loading || codigo.length !== 6}>
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
      {error && <div className="verificar-2fa-error">{error}</div>}
    </div>
  );
};

export default Verificar2FA;
