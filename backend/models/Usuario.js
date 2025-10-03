const pool = require('../database/db');
const bcrypt = require('bcryptjs');

class Usuario {

  // ------------------------
  // Obtener usuario por correo
  // ------------------------
  static async obtenerPorEmail(email) {
    const res = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email.trim()]
    );
    return res.rows[0] || null;
  }

  // ------------------------
  // Guardar token de recuperación y expiración
  // ------------------------
  static async actualizarToken(email, token) {
  const expiryTime = new Date(Date.now() + 3600000); // 1 hora
  const expiryUTC = expiryTime.toISOString(); // UTC
  const res = await pool.query(
    `UPDATE usuarios
     SET reset_password_token = $1,
         reset_password_expires = $2
     WHERE email = $3
     RETURNING id, nombre, email`,
    [token, expiryUTC, email]
  );
  return res.rows[0];
}

// ------------------------
// Obtener usuario por token válido
// ------------------------
static async obtenerPorToken(token) {
  const query = `
    SELECT * 
    FROM usuarios 
    WHERE reset_password_token = $1 
      AND reset_password_expires > NOW()
  `;
  const res = await pool.query(query, [token]);
  return res.rows[0] || null;
}


  // ------------------------
  // Actualizar contraseña y limpiar token
  // ------------------------
  static async actualizarPassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const res = await pool.query(
      `UPDATE usuarios 
       SET password = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2
       RETURNING id, nombre, email`,
      [hashedPassword, id]
    );

    return res.rows[0] || null;
  }
}

module.exports = Usuario;

