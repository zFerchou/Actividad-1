const Usuario = require('../models/Usuario');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await Usuario.crear(nombre, email, password, rol);
    res.json({ mensaje: 'Usuario creado', usuario });
  } catch (err) {
    if (err.code === '23505') { // error de UNIQUE constraint
      res.status(400).json({ error: 'El email ya existe.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = { listarUsuarios, crearUsuario };
