const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

class Usuario {
  static async obtenerTodos() {
    const res = await pool.query(
      'SELECT id, nombre, email, rol, telefono, direccion FROM usuarios ORDER BY id'
    );
    return res.rows;
  }

  static async crear(nombre, email, password, rol, telefono, direccion) {
    const res = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, telefono, direccion) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, nombre, email, rol, telefono, direccion`,
      [nombre, email, password, rol, telefono, direccion]
    );
    return res.rows[0];
  }
}

module.exports = Usuario;
