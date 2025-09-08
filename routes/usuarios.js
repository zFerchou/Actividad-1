const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');

router.get('/', UsuarioController.listar);
router.post('/nuevo', UsuarioController.nuevo);

const { listarUsuarios, crearUsuario } = require('../controllers/UsuarioController');

router.get('/', listarUsuarios);
router.post('/nuevo', crearUsuario);


module.exports = router;
