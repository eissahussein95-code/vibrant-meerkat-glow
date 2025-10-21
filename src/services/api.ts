import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
};

// Job endpoints
export const jobAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }),
  getJobById: (id: number) => api.get(`/jobs/${id}`),
  createJob: (data: any) => api.post('/jobs', data),
  inviteFreelancer: (data: any) => api.post('/jobs/invite', data),
};

// Workspace endpoints
export const workspaceAPI = {
  getWorkspaces: () => api.get('/workspaces'),
  getMessages: (id: number) => api.get(`/workspaces/${id}/messages`),
  getTasks: (id: number) => api.get(`/workspaces/${id}/tasks`),
  createTask: (id: number, data: any) => api.post(`/workspaces/${id}/tasks`, data),
  updateTask: (taskId: number, data: any) => api.patch(`/workspaces/tasks/${taskId}`, data),
  uploadFile: (id: number, formData: FormData) => api.post(`/workspaces/${id}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// User endpoints
export const userAPI = {
  updateProfile: (data: any) => api.put('/users/freelancer/profile', data),
  uploadAvatar: (formData: FormData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  verifyUser: (id: number) => api.patch(`/admin/users/${id}/verify`),
  getAnalytics: () => api.get('/admin/analytics'),
  updateSettings: (data: any) => api.patch('/admin/settings', data),
};

// Payment endpoints
export const paymentAPI = {
  createPaymentIntent: (data: any) => api.post('/payments/create-payment-intent', data),
};
