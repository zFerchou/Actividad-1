const API_URL = 'http://localhost:8080';

export const authService = {
  // Guardar token y usuario
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('autenticado', 'true');
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener usuario
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar autenticación
  isAuthenticated: () => {
    return !!authService.getToken();
  },

  // Cerrar sesión (CORREGIDO)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('autenticado');
    
    // Redirigir a la página de autenticación
    // Usa '/autenticacion' en lugar de '/login' para consistencia con tus otras rutas
    window.location.href = '/autenticacion';
  },

  // Verificar roles
  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user && user.rol === requiredRole;
  },

  hasAnyRole: (requiredRoles) => {
    const user = authService.getCurrentUser();
    return user && requiredRoles.includes(user.rol);
  }
};

export default authService;