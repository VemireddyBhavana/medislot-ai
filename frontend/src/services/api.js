import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAPI = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/admin/register', data);
    return response.data;
  },
};

export const doctorAPI = {
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  add: async (data) => {
    const response = await api.post('/doctors/add', data);
    return response.data;
  }
};

export const appointmentAPI = {
  book: async (data) => {
    const response = await api.post('/appointments/book', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/appointments/${id}`, statusData);
    return response.data;
  }
};

export const notificationAPI = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  }
};

export default api;