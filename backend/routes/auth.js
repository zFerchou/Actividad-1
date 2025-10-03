const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Recuperación de usuario / contraseña
router.post('/forgot-username', authController.forgotUsername);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Verificar token
router.get('/verify-token/:token', authController.verifyToken);

module.exports = router;
