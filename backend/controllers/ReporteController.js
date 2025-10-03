const pool = require('../database/db');
const { Parser } = require('@json2csv/plainjs');
const PDFDocument = require('pdfkit');

// Helper to safely query; if table missing, return fallback
async function safeQuery(query, params = [], fallback = []) {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (e) {
    // Table not found or any error: log and return fallback
    console.warn('safeQuery fallback:', e.message);
    return fallback;
  }
}

exports.estadisticas = async (req, res) => {
  try {
    // Total ventas por producto y sucursal
    const ventasPorProducto = await safeQuery(
      `SELECT producto_id, producto_nombre, sucursal, SUM(cantidad) as unidades, SUM(total) as ventas
       FROM compras
       GROUP BY producto_id, producto_nombre, sucursal
       ORDER BY ventas DESC
       LIMIT 50`,
      [],
      []
    );

    // Productos más consultados (interacciones)
    const productosConsultados = await safeQuery(
      `SELECT producto_id, producto_nombre, COUNT(*) as consultas
       FROM interacciones
       WHERE tipo = 'consulta_producto'
       GROUP BY producto_id, producto_nombre
       ORDER BY consultas DESC
       LIMIT 20`,
      [],
      []
    );

    // Tiempo promedio de interacción por usuario (en segundos)
    const tiempoPromedio = await safeQuery(
      `SELECT AVG(duracion_segundos)::numeric(10,2) as promedio
       FROM interacciones
       WHERE duracion_segundos IS NOT NULL`,
      [],
      [{ promedio: 0 }]
    );

    res.json({
      ventasPorProducto,
      productosConsultados,
      tiempoPromedio: Number(tiempoPromedio[0]?.promedio || 0)
    });
  } catch (e) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};

exports.actividadReciente = async (req, res) => {
  try {
    const actividades = await safeQuery(
      `SELECT usuario_id, tipo, detalle, fecha
       FROM interacciones
       ORDER BY fecha DESC
       LIMIT 100`,
      [],
      []
    );
    res.json(actividades);
  } catch (e) {
    res.status(500).json({ error: 'Error obteniendo actividad' });
  }
};

exports.reportes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipo = 'ventas', productoId, sucursal, formato } = req.query;

    // Filters
    const clauses = [];
    const params = [];

    function addFilter(condition, value) {
      if (value) {
        params.push(value);
        clauses.push(condition.replace('$', `$${params.length}`));
      }
    }

    addFilter('fecha >= $', fechaInicio);
    addFilter('fecha <= $', fechaFin);
    addFilter('producto_id = $', productoId);
    addFilter('sucursal = $', sucursal);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    let rows = [];
    if (tipo === 'ventas') {
      rows = await safeQuery(
        `SELECT id, usuario_id, producto_id, producto_nombre, sucursal, cantidad, precio_unitario, total, fecha
         FROM compras
         ${where}
         ORDER BY fecha DESC
         LIMIT 1000`,
        params,
        []
      );
    } else if (tipo === 'interacciones') {
      rows = await safeQuery(
        `SELECT id, usuario_id, tipo, producto_id, producto_nombre, duracion_segundos, fecha
         FROM interacciones
         ${where}
         ORDER BY fecha DESC
         LIMIT 1000`,
        params,
        []
      );
    } else {
      return res.status(400).json({ error: "Tipo de reporte inválido. Usa 'ventas' o 'interacciones'" });
    }

    if (formato === 'csv') {
      const parser = new Parser({ withBOM: true });
      const csv = parser.parse(rows);
      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.attachment(`reporte_${tipo}.csv`);
      return res.send(csv);
    }

    if (formato === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_${tipo}.pdf`);
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      doc.pipe(res);

      // Título
      doc.fontSize(18).text(`Reporte: ${tipo.toUpperCase()}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Filtros: ${JSON.stringify({ fechaInicio, fechaFin, productoId, sucursal })}`);
      doc.moveDown();

      // Encabezados según tipo
      const headersVentas = ['id', 'usuario_id', 'producto_id', 'producto_nombre', 'sucursal', 'cantidad', 'precio_unitario', 'total', 'fecha'];
      const headersInter = ['id', 'usuario_id', 'tipo', 'producto_id', 'producto_nombre', 'duracion_segundos', 'fecha'];
      const headers = tipo === 'ventas' ? headersVentas : headersInter;

      doc.font('Helvetica-Bold').text(headers.join(' | '));
      doc.moveDown(0.5);
      doc.font('Helvetica');
      rows.forEach(r => {
        const line = headers.map(h => (r[h] != null ? String(r[h]) : '')).join(' | ');
        doc.text(line);
      });

      doc.end();
      return; // streaming response
    }

  res.json({ tipo, filtros: { fechaInicio, fechaFin, productoId, sucursal }, total: rows.length, datos: rows });
  } catch (e) {
    console.error('Error en reportes:', e);
    res.status(500).json({ error: 'Error generando reporte' });
  }
};
