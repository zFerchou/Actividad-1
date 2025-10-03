-- Tabla para almacenar ubicaciones GPS por usuario
CREATE TABLE IF NOT EXISTS public.ubicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  latitud NUMERIC(10,6) NOT NULL,
  longitud NUMERIC(10,6) NOT NULL,
  precision_metros NUMERIC(10,2),
  fuente VARCHAR(40) NOT NULL DEFAULT 'navigator', -- navigator|manual|import
  tipo VARCHAR(40) NOT NULL DEFAULT 'login',       -- login|tracking
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ubicaciones_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ubicaciones_usuario_idx ON public.ubicaciones (usuario_id);
CREATE INDEX IF NOT EXISTS ubicaciones_fecha_idx ON public.ubicaciones (creado_en);