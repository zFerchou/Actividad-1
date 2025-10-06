const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const pool = require('../database/db');
const authController = require('../controllers/authController');
const router = express.Router();

// --- 2FA: almacenamiento en memoria ---
const codigos2FA = new Map(); // userId -> { codigo, expiresAt }

// --- LOGIN + 2FA ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Intentando login con:', { email, password });

    // 1. Buscar usuario
    const result = await pool.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // 2. Verificar contraseña
    if (password !== user.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar código 2FA
    const codigo2FA = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    codigos2FA.set(user.id, { codigo: codigo2FA, expiresAt });

    // 4. Enviar por correo
    try {
      const { enviarCorreo } = require('../utils/mailer');
      await enviarCorreo(user.email, 'Tu código de autenticación 2FA', `Tu código temporal es: ${codigo2FA}\nVálido por 5 minutos.`);
    } catch (err) {
      console.error('Error enviando código 2FA:', err);
      return res.status(500).json({ error: 'No se pudo enviar el código 2FA' });
    }

    // 5. Respuesta
    res.json({
      success: true,
      require2FA: true,
      userId: user.id,
      email: user.email,
      nombre: user.nombre
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- VERIFICAR 2FA ---
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, codigo } = req.body;
    if (!userId || !codigo) return res.status(400).json({ error: 'Faltan datos' });

    const registro = codigos2FA.get(userId);
    if (!registro) return res.status(400).json({ error: 'No se solicitó código 2FA' });
    if (registro.expiresAt < Date.now()) {
      codigos2FA.delete(userId);
      return res.status(400).json({ error: 'Código expirado' });
    }
    if (registro.codigo !== codigo) return res.status(401).json({ error: 'Código incorrecto' });

    codigos2FA.delete(userId);

    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];

    try {
      const { crear: crearNotificacion } = require('../models/Notificacion');
      await crearNotificacion(user.id, 'Inicio de sesión exitoso', false);
    } catch (notifErr) {
      console.error('Error creando notificación de login:', notifErr);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Error en verify-2fa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- Rutas de recuperación de cuenta ---
router.post('/forgot-username', authController.forgotUsername);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-token/:token', authController.verifyToken);

module.exports = router;
