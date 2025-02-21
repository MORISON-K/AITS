// src/api/users.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com/api',
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

