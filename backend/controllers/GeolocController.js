const pool = require('../database/db');

exports.guardarUbicacionLogin = async (req, res) => {
  try {
    const { lat, lng, accuracy, fuente = 'navigator' } = req.body;
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat y lng son requeridos' });

    const q = `INSERT INTO ubicaciones (usuario_id, latitud, longitud, precision_metros, fuente, tipo)
               VALUES ($1, $2, $3, $4, $5, 'login') RETURNING *`;
    const { rows } = await pool.query(q, [usuarioId, lat, lng, accuracy ?? null, fuente]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('guardarUbicacionLogin', e);
    res.status(500).json({ error: 'Error guardando ubicación de login' });
  }
};

exports.trackUbicacion = async (req, res) => {
  try {
    const { lat, lng, accuracy, fuente = 'navigator' } = req.body;
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat y lng son requeridos' });

    const q = `INSERT INTO ubicaciones (usuario_id, latitud, longitud, precision_metros, fuente, tipo)
               VALUES ($1, $2, $3, $4, $5, 'tracking') RETURNING *`;
    const { rows } = await pool.query(q, [usuarioId, lat, lng, accuracy ?? null, fuente]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('trackUbicacion', e);
    res.status(500).json({ error: 'Error guardando tracking' });
  }
};

exports.ultimaUbicacion = async (req, res) => {
  try {
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    const { rows } = await pool.query(
      `SELECT * FROM ubicaciones WHERE usuario_id = $1 ORDER BY creado_en DESC LIMIT 1`,
      [usuarioId]
    );
    res.json(rows[0] || null);
  } catch (e) {
    res.status(500).json({ error: 'Error obteniendo última ubicación' });
  }
};

exports.historial = async (req, res) => {
  try {
    const usuarioId = req.user?.userId;
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    const { fechaInicio, fechaFin, tipo } = req.query;
    const clauses = ['usuario_id = $1'];
    const params = [usuarioId];
    function add(cond, val) {
      if (val) {
        params.push(val);
        clauses.push(cond.replace('$', `$${params.length}`));
      }
    }
    add('creado_en >= $', fechaInicio);
    add('creado_en <= $', fechaFin);
    add('tipo = $', tipo);
    const where = `WHERE ${clauses.join(' AND ')}`;
    const { rows } = await pool.query(
      `SELECT * FROM ubicaciones ${where} ORDER BY creado_en DESC LIMIT 5000`,
      params
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Error obteniendo historial de ubicaciones' });
  }
};
