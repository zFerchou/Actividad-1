import React, { useEffect, useState, useCallback } from 'react';
import { notificacionesAPI } from '../services/api';
import { useSocketNotificaciones } from './useSocketNotificaciones';
import './styles.css';

function Notificaciones({ usuarioId }) {
  const [notificaciones, setNotificaciones] = useState([]);


  useEffect(() => {
    async function fetchNotificaciones() {
      const res = await notificacionesAPI.listar(usuarioId);
      setNotificaciones(res);
    }
    if (usuarioId) fetchNotificaciones();
  }, [usuarioId]);

  // Callback para nueva notificación en tiempo real
  const onNuevaNotificacion = useCallback((notificacion) => {
    setNotificaciones(nots => [notificacion, ...nots]);
  }, []);

  useSocketNotificaciones(usuarioId, onNuevaNotificacion);

  const marcarLeida = async (id) => {
    await notificacionesAPI.marcarLeida(id);
    setNotificaciones(nots => nots.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  return (
    <div className="notificaciones-container">
      <h3>Notificaciones</h3>
      {notificaciones.length === 0 && <p>No tienes notificaciones.</p>}
      <ul>
        {notificaciones.map(n => (
          <li key={n.id} className={n.leida ? 'leida' : 'nueva'}>
            <span>{n.mensaje}</span>
            <span className="fecha">{new Date(n.fecha_creacion).toLocaleString()}</span>
            {!n.leida && (
              <button onClick={() => marcarLeida(n.id)}>Marcar como leída</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notificaciones;
