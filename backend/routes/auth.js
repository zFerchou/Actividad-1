const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const pool = require('../database/db');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// --- 2FA: almacenamiento en memoria ---
// Se almacena por email para no exponer ni requerir el ID del usuario en el paso 2
const codigos2FA = new Map(); // email -> { codigo, expiresAt }

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
  codigos2FA.set(user.email, { codigo: codigo2FA, expiresAt });

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
      userId: user.id, // mantenemos por compatibilidad, pero no será requerido en verify-2fa
      email: user.email,
      nombre: user.nombre
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para validar código 2FA (ahora usa email en lugar de userId)
router.post('/verify-2fa', async (req, res) => {
  try {
    const { email, codigo } = req.body;
    if (!email || !codigo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const registro = codigos2FA.get(email);
    if (!registro) {
      return res.status(400).json({ error: 'No se solicitó código 2FA para este correo' });
    }
    if (registro.expiresAt < Date.now()) {
      codigos2FA.delete(email);
      return res.status(400).json({ error: 'El código ha expirado' });
    }
    if (registro.codigo !== codigo) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }
    // Código correcto, eliminarlo para que no se reutilice
    codigos2FA.delete(email);
    // Buscar usuario para generar token
    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE email = $1',
      [email]
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
        rol: user.rol,
        jti: `${user.id}-${Date.now()}`
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

// Endpoint auxiliar: devuelve el usuario del token (debug)
router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// Acceso "offline": valida un JWT previamente emitido sin requerir reenviar 2FA ahora
router.get('/offline-login', authMiddleware, (req, res) => {
  return res.json({
    success: true,
    offline: true,
    message: 'Acceso offline válido con JWT vigente',
    user: req.user
  });
});

// Exportar router y codigos2FA
module.exports = router;
