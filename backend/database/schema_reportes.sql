-- Esquema para tablas usadas por historial y reportes
-- Base de datos: seguridad (según config.js)

-- Tabla de compras (historial de compras/servicios)
CREATE TABLE IF NOT EXISTS public.compras (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  producto_nombre VARCHAR(255) NOT NULL,
  sucursal VARCHAR(120) NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  total NUMERIC(14,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  estado VARCHAR(40) NOT NULL DEFAULT 'completado', -- p.ej: pendiente, completado, cancelado
  tipo_producto VARCHAR(80) NOT NULL, -- p.ej: servicio, fisico, digital
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT compras_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- Índices recomendados para filtros/reportes
CREATE INDEX IF NOT EXISTS compras_usuario_idx ON public.compras (usuario_id);
CREATE INDEX IF NOT EXISTS compras_fecha_idx ON public.compras (fecha);
CREATE INDEX IF NOT EXISTS compras_producto_idx ON public.compras (producto_id);
CREATE INDEX IF NOT EXISTS compras_sucursal_idx ON public.compras (sucursal);
CREATE INDEX IF NOT EXISTS compras_estado_idx ON public.compras (estado);

-- Tabla de interacciones (actividad de usuario)
CREATE TABLE IF NOT EXISTS public.interacciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo VARCHAR(60) NOT NULL, -- p.ej: consulta_producto, vista_pagina, click_boton, compra
  producto_id INTEGER,
  producto_nombre VARCHAR(255),
  duracion_segundos NUMERIC(10,2), -- opcional
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT interacciones_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- Índices para consultas del dashboard
CREATE INDEX IF NOT EXISTS interacciones_usuario_idx ON public.interacciones (usuario_id);
CREATE INDEX IF NOT EXISTS interacciones_tipo_idx ON public.interacciones (tipo);
CREATE INDEX IF NOT EXISTS interacciones_producto_idx ON public.interacciones (producto_id);
CREATE INDEX IF NOT EXISTS interacciones_fecha_idx ON public.interacciones (fecha);

-- Notas:
-- - La columna total en compras está generada a partir de cantidad * precio_unitario para consistencia.
-- - Ajusta estados y tipos según tus necesidades de negocio.
