const Usuario = require('../models/Usuario');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de correo
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ------------------------
// Recuperar nombre de usuario
// ------------------------
exports.forgotUsername = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Correo requerido' });

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) return res.status(404).json({ success: false, message: 'No se encontró una cuenta con ese correo' });

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

// ------------------------
// Recuperar contraseña
// ------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Correo requerido' });

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
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

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  try {
    const token = (req.body.token || req.query.token || '').trim();
    const { newPassword } = req.body;

    if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });

    const decodedToken = decodeURIComponent(token);  // <-- DECODIFICAR
    const usuario = await Usuario.obtenerPorToken(decodedToken);
    if (!usuario) return res.status(400).json({ success: false, message: 'Token inválido o expirado' });

    await Usuario.actualizarPassword(usuario.id, newPassword);
    res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error resetPassword:', error);
    res.status(500).json({ success: false, message: 'Error interno al restablecer la contraseña' });
  }
};

// Verificar token
exports.verifyToken = async (req, res) => {
  try {
    const token = (req.params.token || req.body.token || '').trim();
    if (!token) return res.status(400).json({ success: false, message: 'No hay token para verificar' });

    console.log('Token recibido en verifyToken:', token);

    const decodedToken = decodeURIComponent(token);  // <-- DECODIFICAR
    const usuario = await Usuario.obtenerPorToken(decodedToken);
    console.log('Usuario encontrado:', usuario);

    if (!usuario) return res.status(400).json({ success: false, message: 'Token inválido o expirado' });

    res.json({ success: true, message: 'Token válido', email: usuario.email });
  } catch (error) {
    console.error('Error verifyToken:', error);
    res.status(500).json({ success: false, message: 'Error al verificar el token' });
  }
};
