import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration or deactivation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    // If unauthorized or account deleted/inactive, handle automatic logout if not on auth page
    if (status === 401 || (status === 403 && (message.includes('deactivated') || message.includes('deleted')))) {
      if (!window.location.pathname.startsWith('/login') && 
          !window.location.pathname.startsWith('/accept-invitation') &&
          !window.location.pathname.startsWith('/reset-password')) {
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_user');
        window.dispatchEvent(new Event('auth_logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
