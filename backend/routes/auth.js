// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const pool = require('../database/db');
const authController = require('../controllers/authController');

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Intentando login con:', { email, password }); // ← Debug

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
    console.log('Usuario encontrado:', user); // ← Debug

    // 2. Verificar contraseña (texto plano, cambiar por bcrypt si quieres)
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

    // 4. Responder con token (sin password)
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

// ===================== RECUPERACIÓN DE USUARIO / CONTRASEÑA =====================
router.post('/forgot-username', authController.forgotUsername);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-token/:token', authController.verifyToken);

module.exports = router;
