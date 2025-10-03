const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GeolocController = require('../controllers/GeolocController');

// Guardar ubicación al iniciar sesión (cliente debe enviar coords justo después del login)
router.post('/login', auth, GeolocController.guardarUbicacionLogin);

// Tracking en tiempo real (cliente envía coords periódicamente)
router.post('/track', auth, GeolocController.trackUbicacion);

// Última ubicación del usuario autenticado
router.get('/last', auth, GeolocController.ultimaUbicacion);

// Historial del usuario autenticado (filtros opcionales)
router.get('/historial', auth, GeolocController.historial);

module.exports = router;
