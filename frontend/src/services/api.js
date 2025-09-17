import authService from './auth';

const API_URL = 'http://localhost:8080';

// Función genérica para requests autenticados
const authFetch = async (endpoint, options = {}) => {
  const token = authService.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si la respuesta es 401 (Unauthorized), cerramos sesión
    if (response.status === 401) {
      authService.logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    // Manejar respuestas sin contenido (204 No Content)
    if (response.status === 204) {
      return null;
    }

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = responseData?.error || 
                          responseData?.message || 
                          `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    
    // Mejorar mensajes de error específicos
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.');
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

// Servicio de autenticación
export const authAPI = {
  login: async (credentials) => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyToken: async () => {
    return authFetch('/auth/verify');
  },

  logout: async () => {
    return authFetch('/auth/logout', {
      method: 'POST',
    });
  }
};

// Servicio de usuarios
export const usersService = {
  obtenerTodos: async () => {
    return authFetch('/usuarios');
  },

  crear: async (usuario) => {
    return authFetch('/usuarios/nuevo', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  },

  obtenerPorId: async (id) => {
    return authFetch(`/usuarios/${id}`);
  },

  actualizar: async (id, usuario) => {
    return authFetch(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  },

  eliminar: async (id) => {
    return authFetch(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  },

  // Nuevos métodos adicionales
  buscarPorEmail: async (email) => {
    return authFetch(`/usuarios/buscar?email=${encodeURIComponent(email)}`);
  },

  cambiarEstado: async (id, activo) => {
    return authFetch(`/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    });
  }
};

// Servicio de perfil (completo y mejorado)
export const profileService = {
  obtenerPerfil: async () => {
    return authFetch('/perfil');
  },

  actualizarPerfil: async (datos) => {
    return authFetch('/perfil', {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
  },

  cambiarPassword: async (passwords) => {
    return authFetch('/perfil/password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },

  // Nuevos métodos para el perfil
  obtenerPreferencias: async () => {
    return authFetch('/perfil/preferencias');
  },

  actualizarPreferencias: async (preferencias) => {
    return authFetch('/perfil/preferencias', {
      method: 'PUT',
      body: JSON.stringify(preferencias),
    });
  },

  subirAvatar: async (formData) => {
    // Para uploads de archivos, necesitamos headers diferentes
    const token = authService.getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // No establecemos Content-Type para que el browser lo establezca con el boundary

    const response = await fetch(`${API_URL}/perfil/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir avatar');
    }

    return response.json();
  },

  eliminarAvatar: async () => {
    return authFetch('/perfil/avatar', {
      method: 'DELETE',
    });
  }
};

// Servicio de dashboard/reportes
export const dashboardService = {
  obtenerEstadisticas: async () => {
    return authFetch('/dashboard/estadisticas');
  },

  obtenerActividadReciente: async () => {
    return authFetch('/dashboard/actividad');
  },

  obtenerReportes: async (fechaInicio, fechaFin) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    
    return authFetch(`/dashboard/reportes?${params.toString()}`);
  }
};

// Utilidades para manejo de errores
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

// Interceptor para redirección automática en errores de autenticación
export const setupApiInterceptor = (navigate) => {
  const originalAuthFetch = authFetch;
  
  // Sobrescribir authFetch para redirección automática
  return async (endpoint, options = {}) => {
    try {
      return await originalAuthFetch(endpoint, options);
    } catch (error) {
      if (error.message.includes('Sesión expirada') || 
          error.message.includes('401') ||
          error.message.includes('No se pudo conectar')) {
        
        authService.logout();
        if (navigate) {
          navigate('/autenticacion', { 
            replace: true,
            state: { 
              error: error.message,
              from: window.location.pathname 
            }
          });
        }
      }
      throw error;
    }
  };
};

export default authFetch;