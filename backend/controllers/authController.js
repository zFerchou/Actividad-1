// controllers/authController.js
const Usuario = require('../models/Usuario');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config'); // <-- Clave JWT centralizada
require('dotenv').config();


// CONFIGURACIÓN DE CORREO

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// RECUPERAR NOMBRE DE USUARIO

exports.forgotUsername = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Correo requerido' });

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario)
      return res.status(404).json({ success: false, message: 'No se encontró una cuenta con ese correo' });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de nombre de usuario',
      html: `<p>Tu nombre de usuario es: <strong>${usuario.nombre}</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Se ha enviado tu nombre de usuario al correo' });
  } catch (error) {
    console.error('Error forgotUsername:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


// RECUPERAR CONTRASEÑA

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Correo requerido' });

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({ success: true, message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora
    await Usuario.actualizarToken(email, resetToken, expiresAt);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodeURIComponent(resetToken)}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Expira en 1 hora.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
  } catch (error) {
    console.error('Error forgotPassword:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


// RESTABLECER CONTRASEÑA

exports.resetPassword = async (req, res) => {
  try {
    const token = (req.body.token || req.query.token || '').trim();
    const { newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });

    const decodedToken = decodeURIComponent(token);
    const usuario = await Usuario.obtenerPorToken(decodedToken);
    if (!usuario)
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });

    await Usuario.actualizarPassword(usuario.id, newPassword);
    res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error resetPassword:', error);
    res.status(500).json({ success: false, message: 'Error interno al restablecer la contraseña' });
  }
};


// VERIFICAR TOKEN (JWT o RECUPERACIÓN)

exports.verifyToken = async (req, res) => {
  try {
    const token = (req.params.token || req.body.token || '').trim();
    if (!token)
      return res.status(400).json({ success: false, message: 'No hay token para verificar' });

    console.log('🔹 Token recibido en verifyToken:', token);

    // 1️⃣ Intentar verificar como JWT (3 segmentos)
    if (token.split('.').length === 3) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('✅ Token JWT válido:', decoded);

        return res.json({
          success: true,
          message: 'Token válido (JWT)',
          email: decoded.email || null,
          userId: decoded.userId || null,
          rol: decoded.rol || null,
          exp: decoded.exp || null
        });
      } catch (err) {
        const msg = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
        return res.status(400).json({ success: false, message: msg });
      }
    }

    // 2️⃣ Si no es JWT, probar como token de recuperación
    const decodedToken = decodeURIComponent(token);
    const usuario = await Usuario.obtenerPorToken(decodedToken);
    console.log('🔍 Usuario encontrado por token de recuperación:', usuario);

    if (!usuario)
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });

    res.json({
      success: true,
      message: 'Token de recuperación válido',
      email: usuario.email
    });
  } catch (error) {
    console.error('Error verifyToken:', error);
    res.status(500).json({ success: false, message: 'Error al verificar el token' });
  }
};
