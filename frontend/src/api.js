// frontend/src/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Your Flask backend URL
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;