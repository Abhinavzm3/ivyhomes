import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://your-backend.onrender.com' : '/api',
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('access_token', res.data.access_token);
        if (res.data.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(error.config);
      } catch (e) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
