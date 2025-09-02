const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.get('/', UsuarioController.listar);
router.post('/nuevo', UsuarioController.nuevo);

module.exports = router;
