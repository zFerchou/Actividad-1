const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');

// Estadísticas generales para dashboard
router.get('/estadisticas', ReporteController.estadisticas);

// Actividad reciente (interacciones)
router.get('/actividad', ReporteController.actividadReciente);

// Reportes con filtros y export (JSON/CSV)
router.get('/reportes', ReporteController.reportes);

module.exports = router;
