-- Datos de ejemplo para pruebas rápidas

-- Compras
INSERT INTO public.compras (usuario_id, producto_id, producto_nombre, sucursal, cantidad, precio_unitario, estado, tipo_producto, fecha)
VALUES
  (1, 101, 'Laptop Pro 14"', 'Sucursal Centro', 1, 950.00, 'completado', 'fisico', NOW() - INTERVAL '2 days'),
  (1, 202, 'Soporte Premium', 'Sucursal Centro', 1, 120.00, 'completado', 'servicio', NOW() - INTERVAL '1 days'),
  (2, 101, 'Laptop Pro 14"', 'Sucursal Norte', 2, 930.00, 'completado', 'fisico', NOW() - INTERVAL '7 days'),
  (2, 303, 'Licencia Office', 'Sucursal Online', 3, 15.50, 'pendiente', 'digital', NOW() - INTERVAL '5 days'),
  (1, 404, 'Mouse Inalámbrico', 'Sucursal Centro', 2, 25.00, 'cancelado', 'fisico', NOW() - INTERVAL '10 days');

-- Interacciones
INSERT INTO public.interacciones (usuario_id, tipo, producto_id, producto_nombre, duracion_segundos, fecha)
VALUES
  (1, 'consulta_producto', 101, 'Laptop Pro 14"', 35.2, NOW() - INTERVAL '3 days'),
  (1, 'consulta_producto', 404, 'Mouse Inalámbrico', 12.8, NOW() - INTERVAL '9 days'),
  (2, 'consulta_producto', 101, 'Laptop Pro 14"', 48.7, NOW() - INTERVAL '8 days'),
  (2, 'vista_pagina', NULL, NULL, 20.0, NOW() - INTERVAL '1 days'),
  (1, 'click_boton', NULL, NULL, NULL, NOW() - INTERVAL '12 hours');
