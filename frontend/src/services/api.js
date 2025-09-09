const API_URL = 'http://localhost:8080'; // ya coincide con tu config.server.port

export async function obtenerUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json(); // devuelve arreglo [{id, nombre, email, rol}, ...]
}

export async function crearUsuario(usuario) {
  const res = await fetch(`${API_URL}/usuarios/nuevo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Error al crear usuario');
  }
  return res.json(); // devuelve el usuario creado
}
