import axios from 'axios';


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_BACKEND_API_URL || 'http://localhost:8000',
});

export default apiClient;
