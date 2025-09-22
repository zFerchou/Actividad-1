// controllers/authController.js
const Usuario = require('../models/Usuario');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga variables de entorno desde .env

// Configurar transporter de Nodemailer correctamente
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

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico es requerido'
      });
    }

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una cuenta con ese correo electrónico'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de nombre de usuario',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de nombre de usuario</h2>
          <p>Hola,</p>
          <p>Has solicitado recuperar tu nombre de usuario.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tu nombre de usuario es:</strong> ${usuario.nombre}</p>
          </div>
          <p>Si no solicitaste esta acción, por favor ignora este correo.</p>
          <br>
          <p>Saludos,<br>El equipo de soporte</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Se ha enviado tu nombre de usuario a tu correo electrónico'
    });

  } catch (error) {
    console.error('Error en forgotUsername:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar la solicitud'
    });
  }
};

// ------------------------
// Recuperar contraseña
// ------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico es requerido'
      });
    }

    const usuario = await Usuario.obtenerPorEmail(email);
    if (!usuario) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({
        success: true,
        message: 'Si el correo existe, se ha enviado un enlace de recuperación'
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    await Usuario.actualizarToken(email, resetToken);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de contraseña</h2>
          <p>Hola ${usuario.nombre},</p>
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            <strong>Nota:</strong> Este enlace expirará en 1 hora.
          </p>
          <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
          <br>
          <p>Saludos,<br>El equipo de soporte</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Si el correo existe, se ha enviado un enlace de recuperación'
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar la solicitud'
    });
  }
};

// ------------------------
// Restablecer contraseña
// ------------------------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const usuario = await Usuario.obtenerPorToken(token);
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'El token es inválido o ha expirado'
      });
    }

    await Usuario.actualizarPassword(usuario.id, newPassword);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: usuario.email,
      subject: 'Contraseña restablecida exitosamente',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contraseña restablecida</h2>
          <p>Hola ${usuario.nombre},</p>
          <p>Tu contraseña ha sido restablecida exitosamente.</p>
          <p>Si no realizaste esta acción, contacta inmediatamente al equipo de soporte.</p>
          <br>
          <p>Saludos,<br>El equipo de soporte</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al restablecer la contraseña'
    });
  }
};

// ------------------------
// Verificar token válido
// ------------------------
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await Usuario.obtenerPorToken(token);
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      email: usuario.email
    });

  } catch (error) {
    console.error('Error en verifyToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el token'
    });
  }
};
