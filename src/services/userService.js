import api from './api';

export const userService = {
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMyProfile: async (profileData) => {
    const response = await api.patch('/users/me', profileData);
    return response.data;
  },

  changePassword: async ({ currentPassword, newPassword, confirmNewPassword }) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
    if (response.data?.token) {
      localStorage.setItem('erp_token', response.data.token);
    }
    return response.data;
  }
};
