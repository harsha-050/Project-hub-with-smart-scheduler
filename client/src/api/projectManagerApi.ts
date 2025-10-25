import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_PM_API_URL || 'http://localhost:5000/api';

const pmApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
pmApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
pmApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    return await pmApi.post('/auth/register', data);
  },
  
  login: async (data: { email: string; password: string }) => {
    return await pmApi.post('/auth/login', data);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return await pmApi.get('/projects');
  },
  
  get: async (id: number) => {
    return await pmApi.get(`/projects/${id}`);
  },
  
  create: async (data: { title: string; description?: string }) => {
    return await pmApi.post('/projects', data);
  },
  
  delete: async (id: number) => {
    return await pmApi.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  create: async (projectId: number, data: {
    title: string;
    dueDate?: string;
    estimatedHours?: number;
    dependencies?: string;
  }) => {
    const response = await pmApi.post(`/tasks/projects/${projectId}/tasks`, {
      title: data.title,
      dueDate: data.dueDate,
      estimatedHours: data.estimatedHours || 5,
      dependencies: data.dependencies || '[]',
    });
    return response.data;
  },
  
  update: async (taskId: number, data: {
    title?: string;
    dueDate?: string;
    completionStatus?: boolean;
    estimatedHours?: number;
    dependencies?: string;
  }) => {
    const response = await pmApi.put(`/tasks/${taskId}`, data);
    return response.data;
  },
  
  delete: async (taskId: number) => {
    await pmApi.delete(`/tasks/${taskId}`);
  },
};

export default pmApi;
