import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:7208/api', // Changed to correct HTTP port
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
