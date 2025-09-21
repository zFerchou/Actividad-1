// routes/notificaciones.js
const express = require('express');
const router = express.Router();
const {
  crearNotificacion,
  listarNotificaciones,
  marcarLeida,
  eliminarExpiradas
} = require('../controllers/NotificacionController');

// Crear una notificación
router.post('/', crearNotificacion);

// Listar notificaciones de un usuario
router.get('/:usuario_id', listarNotificaciones);

// Marcar notificación como leída
router.patch('/leida/:id', marcarLeida);

// Eliminar notificaciones expiradas
router.delete('/expiradas', eliminarExpiradas);

module.exports = router;
