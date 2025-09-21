const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const pool = require('../database/db');

// Ruta POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Intentando login con:', { email, password }); // ← Para debug

    // 1. Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    console.log('Usuario encontrado:', user); // ← Para debug

    // 2. Verificar contraseña (texto plano)
    if (password !== user.password) {
      console.log('Contraseña incorrecta para usuario:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        rol: user.rol 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );


    // 4. Enviar notificación crítica por email al iniciar sesión
    try {
      const Notificacion = require('../models/Notificacion');
      const { enviarCorreo } = require('../utils/mailer');
      const { getIO, getUsuariosConectados } = require('../socket');
      const mensaje = `¡Hola ${user.nombre}! Has iniciado sesión en tu cuenta el ${new Date().toLocaleString()}`;
      // Crear notificación en la base de datos
      const notificacion = await Notificacion.crear(user.id, mensaje, true);
      // Enviar correo
      await enviarCorreo(user.email, 'Notificación de inicio de sesión', mensaje);
      // Emitir en tiempo real si está conectado
      const usuariosConectados = getUsuariosConectados();
      const io = getIO();
      const socketId = usuariosConectados.get(String(user.id));
      if (io && socketId) {
        io.to(socketId).emit('nuevaNotificacion', notificacion);
      }
    } catch (notifErr) {
      console.error('Error enviando notificación de inicio de sesión:', notifErr);
    }

    // 5. Responder con token (elimina password de la respuesta)
    const { password: _, ...userWithoutPassword } = user;
    console.log('Login exitoso para:', email);
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;