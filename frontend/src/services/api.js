const API_URL = 'http://localhost:8080';

export async function obtenerUsuarios() {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    if (!res.ok) {
      // Intenta obtener más detalles del error
      const errorData = await res.json().catch(() => ({ error: `Error ${res.status}: ${res.statusText}` }));
      throw new Error(errorData.error || errorData.message || 'Error al obtener usuarios');
    }
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error);
    throw new Error(error.message || 'No se pudo conectar con el servidor');
  }
}

export async function crearUsuario(usuario) {
  try {
    const res = await fetch(`${API_URL}/usuarios/nuevo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: `Error ${res.status}: ${res.statusText}` }));
      throw new Error(errorData.error || errorData.message || 'Error al crear usuario');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error en crearUsuario:', error);
    throw new Error(error.message || 'No se pudo conectar con el servidor');
  }
}