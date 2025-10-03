


import React from 'react';
import Notificaciones from './Notificaciones';
import authService from '../services/authService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import '../styles/NotificacionScreen.css';




function NotificacionScreen() {
  const user = authService.getCurrentUser();
  const online = useOnlineStatus();
  return (
    <div className="notificacion-screen">
      <div className="notificacion-header">
        <h2>🔔 Notificaciones</h2>
        <p className="notificacion-desc">Aquí puedes ver todas tus notificaciones importantes y pendientes.</p>
      </div>
      {!online && (
        <div style={{color:'orange', marginBottom: 16, fontWeight: 'bold'}}>
          Estás en modo solo lectura. No puedes acceder a las funciones protegidas sin conexión.
        </div>
      )}
      <div className="notificacion-list-wrapper">
        {user && <Notificaciones usuarioId={user.id} online={online} />}
      </div>
    </div>
  );
}

export default NotificacionScreen;
