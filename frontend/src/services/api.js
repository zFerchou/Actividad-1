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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Error ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw new Error(error.message || 'No se pudo conectar con el servidor');
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
  }
};

// Servicio de usuarios
export const usersService = {
  obtenerUsuarios: async () => {
    return authFetch('/usuarios');
  },

  crearUsuario: async (usuario) => {
    return authFetch('/usuarios/nuevo', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  },

  obtenerUsuario: async (id) => {
    return authFetch(`/usuarios/${id}`);
  },

  actualizarUsuario: async (id, usuario) => {
    return authFetch(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  },

  eliminarUsuario: async (id) => {
    return authFetch(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicio de perfil
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
  }
};

export default authFetch;