import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tv_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const tradesService = {
  getAll: (params) => api.get('/trades', { params }),
  add: (data) => api.post('/trades', data),
  update: (id, data) => api.put(`/trades/${id}`, data),
  remove: (id) => api.delete(`/trades/${id}`),
};

export const portfolioService = {
  getSummary: () => api.get('/portfolio'),
  getPnL: (period) => api.get('/portfolio/pnl', { params: { period } }),
};

export const watchlistService = {
  getAll: () => api.get('/watchlist'),
  add: (data) => api.post('/watchlist', data),
  remove: (symbol) => api.delete(`/watchlist/${symbol}`),
};

export default api;
