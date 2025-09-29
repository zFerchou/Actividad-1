const express = require('express');
const router = express.Router();
const pool = require('../database/db');

async function safeQuery(query, params = [], fallback = []) {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (e) {
    console.warn('safeQuery fallback:', e.message);
    return fallback;
  }
}

// GET /historial/:usuarioId
// Filtros: fechaInicio, fechaFin, tipoProducto, estado, sortBy=fecha|monto, order=asc|desc
router.get('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { fechaInicio, fechaFin, tipoProducto, estado, sortBy = 'fecha', order = 'desc' } = req.query;

    const clauses = ['usuario_id = $1'];
    const params = [usuarioId];
    function addFilter(condition, value) {
      if (value) {
        params.push(value);
        clauses.push(condition.replace('$', `$${params.length}`));
      }
    }
    addFilter('fecha >= $', fechaInicio);
    addFilter('fecha <= $', fechaFin);
    addFilter('tipo_producto = $', tipoProducto);
    addFilter('estado = $', estado);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const sortColumn = sortBy === 'monto' ? 'total' : 'fecha';
    const sortOrder = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const rows = await safeQuery(
      `SELECT id, producto_id, producto_nombre, cantidad, precio_unitario, total, estado, tipo_producto, fecha
       FROM compras
       ${where}
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT 1000`,
      params,
      []
    );

    res.json({ usuarioId: Number(usuarioId), total: rows.length, compras: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

module.exports = router;
