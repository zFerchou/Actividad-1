
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

const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'editor', 'lector'),
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});


module.exports = Usuario;
