import React, { useState, useEffect } from 'react';

const APICheck = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      
      const response = await fetch('http://localhost:8080/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
      setError(err.message);
      
      
      if (err.message.includes('Failed to fetch')) {
        setError('No se puede conectar al servidor');
      } else if (err.message.includes('NetworkError')) {
        setError('Error de red - verifica la conexión');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '10px',
      background: apiStatus === 'online' ? '#d4edda' : '#f8d7da',
      color: apiStatus === 'online' ? '#155724' : '#721c24',
      border: '1px solid',
      borderRadius: '5px',
      zIndex: 1000,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <strong>Estado API:</strong> {apiStatus === 'online' ? '✅ Conectada' : `❌ ${error}`}
      <br />
      <small>URL: http://localhost:8080</small>
    </div>
  );
};

export default APICheck;