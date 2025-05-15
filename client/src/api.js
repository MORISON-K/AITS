// import axios from "axios"
// import { ACCESS_TOKEN } from "./constants"


// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
// });

// console.log('API Base URL:', import.meta.env.VITE_API_URL);

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//             return Promise.reject(error)
//         }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // This will use relative URLs that work in both development and production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
