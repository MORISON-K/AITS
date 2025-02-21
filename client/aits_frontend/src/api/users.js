// src/api/users.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
  });  

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

