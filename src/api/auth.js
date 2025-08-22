// src/api/auth.js
import axios from 'axios';

// Create an axios instance for Laravel API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  // ^ Change to match EXACT URL where Laravel serves routes/api.php
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach token automatically for authenticated requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  register(data) {
    return api.post('/register', data);
  },

  login(data) {
    return api.post('/login', data);
  },

  logout() {
    return api.post('/logout');
  },

  getUser() {
    return api.get('/user');
  },
};
