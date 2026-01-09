import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Projects
export const projectsApi = {
    getAll: () => api.get('/projects'),
    getById: (id: number) => api.get(`/projects/${id}`),
    create: (data: { name: string; description?: string }) => api.post('/projects', data),
    update: (id: number, data: { name: string; description?: string }) => api.put(`/projects/${id}`, data),
    delete: (id: number) => api.delete(`/projects/${id}`),
};

// Users
export const usersApi = {
    getByProject: (projectId: number) => api.get(`/users/project/${projectId}`),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: number, data: any) => api.put(`/users/${id}`, data),
    delete: (id: number) => api.delete(`/users/${id}`),
};

// Pages
export const pagesApi = {
    getByProject: (projectId: number) => api.get(`/pages/project/${projectId}`),
    getById: (id: number) => api.get(`/pages/${id}`),
    create: (data: { projectId: number; name: string; description?: string }) => api.post('/pages', data),
    update: (id: number, data: { name: string; description?: string }) => api.put(`/pages/${id}`, data),
    delete: (id: number) => api.delete(`/pages/${id}`),
};

// Functionalities
export const functionalitiesApi = {
    getByPage: (pageId: number) => api.get(`/functionalities/page/${pageId}`),
    getById: (id: number) => api.get(`/functionalities/${id}`),
    create: (data: any) => api.post('/functionalities', data),
    update: (id: number, data: any) => api.put(`/functionalities/${id}`, data),
    delete: (id: number) => api.delete(`/functionalities/${id}`),
};

// Workflows
export const workflowsApi = {
    getByProject: (projectId: number) => api.get(`/workflows/project/${projectId}`),
    getById: (id: number) => api.get(`/workflows/${id}`),
    create: (data: { projectId: number; name: string; description?: string; flowchartData?: any }) => api.post('/workflows', data),
    update: (id: number, data: { name?: string; description?: string; flowchartData?: any }) => api.put(`/workflows/${id}`, data),
    delete: (id: number) => api.delete(`/workflows/${id}`),
};

export default api;
