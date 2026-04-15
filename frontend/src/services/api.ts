import axios from 'axios';
import toast from 'react-hot-toast';
import { Story, UploadStoryData, ChatMessage, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Story endpoints
export const storyAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/stories', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },
  upload: async (formData: FormData) => {
    const response = await api.post('/stories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getUserStories: async () => {
    const response = await api.get('/stories/user/me');
    return response.data;
  },
};

// AI endpoints
export const aiAPI = {
  transcribe: async (storyId: number) => {
    const response = await api.post(`/ai/transcribe/${storyId}`);
    return response.data;
  },
  translate: async (transcriptId: number, targetLang: string = 'en') => {
    const response = await api.post(`/ai/translate/${transcriptId}?target_lang=${targetLang}`);
    return response.data;
  },
  summarize: async (storyId: number) => {
    const response = await api.post(`/ai/summarize/${storyId}`);
    return response.data;
  },
};

// Blockchain endpoints
export const blockchainAPI = {
  mintProof: async (storyId: number) => {
    const response = await api.post(`/blockchain/mint/${storyId}`);
    return response.data;
  },
  verifyProof: async (storyId: number) => {
    const response = await api.get(`/blockchain/verify/${storyId}`);
    return response.data;
  },
};

// Chat endpoints
export const chatAPI = {
  sendMessage: async (message: string) => {
    const response = await api.post('/chat', { message });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },
};

export default api;