const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const pool = require('../database/db');
const authController = require('../controllers/authController');

// --- 2FA: almacenamiento en memoria ---
const codigos2FA = new Map(); // userId -> { codigo, expiresAt }

// Ruta POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Intentando login con:', { email, password }); // Debug

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
    console.log('Usuario encontrado:', user); // Debug

    // 2. Verificar contraseña (texto plano, cambiar por bcrypt si quieres)
    if (password !== user.password) {
      console.log('Contraseña incorrecta para usuario:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar código temporal 2FA (6 dígitos)
    const codigo2FA = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos
    codigos2FA.set(user.id, { codigo: codigo2FA, expiresAt });

    // 4. Enviar código por correo
    try {
      const { enviarCorreo } = require('../utils/mailer');
      await enviarCorreo(user.email, 'Tu código de autenticación 2FA', `Tu código temporal es: ${codigo2FA}\nVálido por 5 minutos.`);
    } catch (err) {
      console.error('Error enviando código 2FA:', err);
      return res.status(500).json({ error: 'No se pudo enviar el código 2FA' });
    }

    // 5. Responder indicando que se requiere 2FA
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

// Endpoint para validar código 2FA
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, codigo } = req.body;
    if (!userId || !codigo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const registro = codigos2FA.get(userId);
    if (!registro) {
      return res.status(400).json({ error: 'No se solicitó código 2FA para este usuario' });
    }
    if (registro.expiresAt < Date.now()) {
      codigos2FA.delete(userId);
      return res.status(400).json({ error: 'El código ha expirado' });
    }
    if (registro.codigo !== codigo) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }
    // Código correcto, eliminarlo para que no se reutilice
    codigos2FA.delete(userId);
    // Buscar usuario para generar token
    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = result.rows[0];

    // Crear notificación de inicio de sesión exitosa
    try {
      const { crear: crearNotificacion } = require('../models/Notificacion');
      await crearNotificacion(user.id, 'Inicio de sesión exitoso', false);
    } catch (notifErr) {
      console.error('Error creando notificación de login:', notifErr);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        rol: user.rol
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Error en verify-2fa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===================== RECUPERACIÓN DE USUARIO / CONTRASEÑA =====================
router.post('/forgot-username', authController.forgotUsername);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-token/:token', authController.verifyToken);

// Exportar router y codigos2FA
module.exports = router;
