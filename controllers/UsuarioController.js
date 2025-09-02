const Usuario = require('../models/Usuario');

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
