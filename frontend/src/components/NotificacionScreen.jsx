

import React from 'react';
import Notificaciones from './Notificaciones';
import { authService } from '../services/auth';
import '../styles/NotificacionScreen.css';



function NotificacionScreen() {
  const user = authService.getCurrentUser();
  return (
    <div className="notificacion-screen">
      <div className="notificacion-header">
        <h2>🔔 Notificaciones</h2>
        <p className="notificacion-desc">Aquí puedes ver todas tus notificaciones importantes y pendientes.</p>
      </div>
      <div className="notificacion-list-wrapper">
        {user && <Notificaciones usuarioId={user.id} />}
      </div>
    </div>
  );
}

export default NotificacionScreen;
