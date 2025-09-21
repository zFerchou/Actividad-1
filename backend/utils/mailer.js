// backend/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'mitsimy@gmail.com',
    pass: process.env.SMTP_PASS || 'ursa kaua eswo raxa',
  },
});

async function enviarCorreo(destinatario, asunto, mensaje) {
  await transporter.sendMail({
    from: 'Notificaciones <notificaciones@tuapp.com>',
    to: destinatario,
    subject: asunto,
    text: mensaje,
  });
}

module.exports = { enviarCorreo };
