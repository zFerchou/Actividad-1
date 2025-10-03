import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/auth';

const authService = {
  // Guardar token y usuario en localStorage
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('autenticado', 'true');
    localStorage.removeItem('offlineMode');
  },

  getToken: () => localStorage.getItem('token'),

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('autenticado');
    window.location.href = '/login';
  },

  // Login con email y contraseña
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  // Verificación de código 2FA
  verify2FA: async (userId, codigo) => {
    const response = await axios.post(`${API_URL}/verify-2fa`, { userId, codigo });
    const { token, user } = response.data;
    authService.setAuthData(token, user);
    return response.data;
  },

  // Recuperar nombre de usuario
  forgotUsername: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-username`, { email });
    return response.data;
  },

  // Solicitar enlace para restablecer contraseña
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  // Restablecer contraseña con token
  resetPassword: async (token, newPassword) => {
    if (!token) throw new Error('No hay token para restablecer la contraseña');
    const encodedToken = encodeURIComponent(token);
    const response = await axios.post(`${API_URL}/reset-password`, { token: encodedToken, newPassword });
    return response.data;
  },

  // Verificar token de recuperación
  verifyToken: async (token) => {
    if (!token) throw new Error('No hay token para verificar');
    const encodedToken = encodeURIComponent(token);
    const response = await axios.get(`${API_URL}/verify-token/${encodedToken}`);
    return response.data;
  },

  // Decodificar JWT
  parseJwt: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')));
    } catch {
      return null;
    }
  },

  // Obtener expiración del token
  getTokenExp: () => {
    const token = authService.getToken();
    if (!token) return null;
    const payload = authService.parseJwt(token);
    return payload?.exp || null;
  },

  // Verificar si el token sigue siendo válido
  isTokenValid: () => {
    const exp = authService.getTokenExp();
    if (!exp) return false;
    return Math.floor(Date.now() / 1000) < exp;
  },

  // Modo offline
  enterOfflineMode: () => localStorage.setItem('offlineMode', 'true'),
  exitOfflineMode: () => localStorage.removeItem('offlineMode'),
  isOfflineMode: () => localStorage.getItem('offlineMode') === 'true',
  canLoginOffline: () => !!authService.getCurrentUser() && authService.isTokenValid(),
};

export default authService;
