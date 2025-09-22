import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useSocketNotificaciones(usuarioId, onNuevaNotificacion) {
  useEffect(() => {
    if (!usuarioId) return;
    const socket = io('http://localhost:8080', {
      transports: ['websocket'],
      withCredentials: true
    });
    socket.emit('registrarUsuario', String(usuarioId));
    socket.on('nuevaNotificacion', (notificacion) => {
      onNuevaNotificacion(notificacion);
    });
    return () => {
      socket.disconnect();
    };
  }, [usuarioId, onNuevaNotificacion]);
}
