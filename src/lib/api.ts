import axios from 'axios';
import { getToken, clearToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.error || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
