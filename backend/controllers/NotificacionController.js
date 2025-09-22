// controllers/NotificacionController.js
const Notificacion = require('../models/Notificacion');
const Usuario = require('../models/Usuario');
const { enviarCorreo } = require('../utils/mailer');
const { getIO, getUsuariosConectados } = require('../socket');

const crearNotificacion = async (req, res) => {
  try {
    const { usuario_id, mensaje, critica } = req.body;
    const notificacion = await Notificacion.crear(usuario_id, mensaje, critica);

    // Emitir notificación en tiempo real si el usuario está conectado
    const usuariosConectados = getUsuariosConectados();
    const io = getIO();
    const socketId = usuariosConectados.get(String(usuario_id));
    if (io && socketId) {
      io.to(socketId).emit('nuevaNotificacion', notificacion);
    }

    // Si es crítica, enviar correo
    if (critica) {
      const email = await Usuario.obtenerEmailPorId(usuario_id);
      if (email) {
        await enviarCorreo(email, 'Notificación importante', mensaje);
      }
    }

    res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ error: error.message || 'Error al crear notificación' });
  }
};

const listarNotificaciones = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const notificaciones = await Notificacion.listarPorUsuario(usuario_id);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

const marcarLeida = async (req, res) => {
  try {
    console.log('PATCH /notificaciones/leida/:id llamada');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    const { id } = req.params;
    const notificacion = await Notificacion.marcarLeida(id);
    console.log('Resultado de marcarLeida:', notificacion);
    res.json(notificacion);
  } catch (error) {
    console.error('Error en marcarLeida:', error);
    res.status(500).json({ error: 'Error al marcar como leída' });
  }
};

const eliminarExpiradas = async (req, res) => {
  try {
    await Notificacion.eliminarExpiradas();
    res.json({ mensaje: 'Notificaciones expiradas eliminadas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar notificaciones expiradas' });
  }
};

module.exports = {
  crearNotificacion,
  listarNotificaciones,
  marcarLeida,
  eliminarExpiradas
};
