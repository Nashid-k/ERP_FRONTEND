import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  acceptInvitation: async ({ token, email, password, confirmPassword, name }) => {
    const response = await api.post('/auth/accept-invitation', {
      token,
      email,
      password,
      confirmPassword,
      name
    });
    return response.data;
  },

  verifyEmail: async (token, email) => {
    const response = await api.post('/auth/verify-email', { token, email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async ({ token, password, confirmPassword }) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout request errors
    } finally {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
    }
  }
};
