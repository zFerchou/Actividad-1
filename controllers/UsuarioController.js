const Usuario = require('../models/Usuario');

<<<<<<< HEAD
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios); // devuelve JSON
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.nuevo = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await Usuario.crear(nombre, email, password, rol);
    res.json(usuario); // devuelve JSON del usuario creado
  } catch (err) {
    res.status(500).send(err.message);
  }
};
=======
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await Usuario.create({ nombre, email, password, rol });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { listarUsuarios, crearUsuario };
>>>>>>> 358ad3ceb5687a92fb6e698611069d1a0a10c14b
