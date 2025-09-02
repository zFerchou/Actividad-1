const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

class Usuario {
  static async obtenerTodos() {
    const res = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
    return res.rows;
  }

  static async crear(nombre, email, password, rol) {
    const res = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, password, rol]
    );
    return res.rows[0];
  }
}

module.exports = Usuario;
