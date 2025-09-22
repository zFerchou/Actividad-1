import { useEffect, useState, useCallback } from 'react';
import { notificacionesAPI } from '../services/api';
import { useSocketNotificaciones } from '../components/useSocketNotificaciones';

export function useNotificaciones(usuarioId) {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    async function fetchNotificaciones() {
      const res = await notificacionesAPI.listar(usuarioId);
      setNotificaciones(res);
    }
    if (usuarioId) fetchNotificaciones();
  }, [usuarioId]);

  const onNuevaNotificacion = useCallback((notificacion) => {
    setNotificaciones(nots => [notificacion, ...nots]);
  }, []);

  useSocketNotificaciones(usuarioId, onNuevaNotificacion);

  const marcarLeida = async (id) => {
    await notificacionesAPI.marcarLeida(id);
    setNotificaciones(nots => nots.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return { notificaciones, setNotificaciones, marcarLeida, noLeidas };
}
