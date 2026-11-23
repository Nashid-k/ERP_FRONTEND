import api from './api';

export const adminService = {
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  blockUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/block`);
    return response.data;
  },

  unblockUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/unblock`);
    return response.data;
  },

  softDeleteUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/block`);
    return response.data;
  },

  restoreUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/unblock`);
    return response.data;
  },

  resendInvitation: async (id) => {
    const response = await api.post(`/admin/users/${id}/resend-invitation`);
    return response.data;
  },

  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  }
};
