// src/services/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/auth';

const authService = {
  // Guardar token y usuario en localStorage
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('autenticado', 'true');
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

  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;
    authService.setAuthData(token, user);
    return response.data;
  },

  // Recuperar nombre de usuario
  forgotUsername: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-username`, { email });
    return response.data;
  },

  // Recuperar contraseña
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  },

  // Verificar token válido usando el endpoint del backend
  verifyToken: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token para verificar');
    const response = await axios.get(`${API_URL}/verify-token/${token}`);
    return response.data;
  },
};

export default authService;
