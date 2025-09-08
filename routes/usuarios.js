const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const UsuarioController = require('../controllers/UsuarioController');

router.get('/', UsuarioController.listar);
router.post('/nuevo', UsuarioController.nuevo);
=======
const { listarUsuarios, crearUsuario } = require('../controllers/UsuarioController');

router.get('/', listarUsuarios);
router.post('/nuevo', crearUsuario);
>>>>>>> 358ad3ceb5687a92fb6e698611069d1a0a10c14b

module.exports = router;
