const express = require('express');
const router = express.Router();
const { listarUsuarios, crearUsuario } = require('../controllers/UsuarioController');

router.get('/', listarUsuarios);
router.post('/', crearUsuario);

module.exports = router;
