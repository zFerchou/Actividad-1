const express = require('express');
const router = express.Router(); // ✅ ahora sí lo defines
const autenticacionMiddleware = require('../middleware/auth'); 
const pool = require('../database/db');

// GET /perfil - Obtener perfil del usuario
router.get('/', autenticacionMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(
      'SELECT id, nombre, email, telefono, direccion, rol FROM usuarios WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en GET /perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// PUT /perfil - Actualizar perfil del usuario
router.put('/', autenticacionMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nombre, telefono, direccion } = req.body;
    
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, telefono = $2, direccion = $3 WHERE id = $4 RETURNING id, nombre, email, telefono, direccion, rol',
      [nombre, telefono, direccion, userId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en PUT /perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Rutas de perfil funcionando correctamente' });
});

module.exports = router; // ✅ exportas correctamente
