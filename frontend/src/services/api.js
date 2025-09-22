// src/services/api.js
import authService from './auth';

const API_URL = 'http://localhost:8080';

// Función genérica para requests autenticados
const authFetch = async (endpoint, options = {}) => {
  const token = authService.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // Logout solo si hay token y recibimos 401
    if (response.status === 401 && token) {
      authService.logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error || data?.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.');
    }
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

// ----------------- Servicios -----------------
export const authAPI = {
  login: async (credentials) => authService.login(credentials.email, credentials.password),
  register: async (userData) => authFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  verifyToken: async () => authService.verifyToken(),
  logout: async () => authFetch('/auth/logout', { method: 'POST' }),
};

export const usersService = {
  obtenerTodos: async () => authFetch('/usuarios'),
  crear: async (usuario) => authFetch('/usuarios/nuevo', { method: 'POST', body: JSON.stringify(usuario) }),
  obtenerPorId: async (id) => authFetch(`/usuarios/${id}`),
  actualizar: async (id, usuario) => authFetch(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(usuario) }),
  eliminar: async (id) => authFetch(`/usuarios/${id}`, { method: 'DELETE' }),
  buscarPorEmail: async (email) => authFetch(`/usuarios/buscar?email=${encodeURIComponent(email)}`),
  cambiarEstado: async (id, activo) => authFetch(`/usuarios/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ activo }) }),
};

export const profileService = {
  obtenerPerfil: async () => authFetch('/perfil'),
  actualizarPerfil: async (datos) => authFetch('/perfil', { method: 'PUT', body: JSON.stringify(datos) }),
  cambiarPassword: async (passwords) => authFetch('/perfil/password', { method: 'PUT', body: JSON.stringify(passwords) }),
  obtenerPreferencias: async () => authFetch('/perfil/preferencias'),
  actualizarPreferencias: async (preferencias) => authFetch('/perfil/preferencias', { method: 'PUT', body: JSON.stringify(preferencias) }),
  subirAvatar: async (formData) => {
    const token = authService.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/perfil/avatar`, { method: 'POST', headers, body: formData });
    if (!response.ok) throw new Error('Error al subir avatar');
    return response.json();
  },
  eliminarAvatar: async () => authFetch('/perfil/avatar', { method: 'DELETE' }),
};

export const dashboardService = {
  obtenerEstadisticas: async () => authFetch('/dashboard/estadisticas'),
  obtenerActividadReciente: async () => authFetch('/dashboard/actividad'),
  obtenerReportes: async (fechaInicio, fechaFin) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    return authFetch(`/dashboard/reportes?${params.toString()}`);
  },
};

// Manejo de errores
export const handleApiError = (error, defaultMessage = 'Error en la operación') => {
  console.error('Error de API:', error);
  if (error.message.includes('Sesión expirada')) {
    authService.logout();
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
  }
  if (error.message.includes('No se pudo conectar')) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }
  return error.message || defaultMessage;
};

export const setupApiInterceptor = (navigate) => {
  const originalAuthFetch = authFetch;
  return async (endpoint, options = {}) => {
    try {
      return await originalAuthFetch(endpoint, options);
    } catch (error) {
      if (error.message.includes('Sesión expirada') || error.message.includes('401') || error.message.includes('No se pudo conectar')) {
        authService.logout();
        if (navigate) {
          navigate('/autenticacion', { replace: true, state: { error: error.message, from: window.location.pathname } });
        }
      }
      throw error;
    }
  };
};

export default authFetch;
