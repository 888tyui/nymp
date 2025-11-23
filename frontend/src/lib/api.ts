import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Workspace APIs
export const workspaceApi = {
  getAll: (walletAddress?: string) =>
    api.get('/workspace', { params: { wallet_address: walletAddress } }),
  getById: (id: string) => api.get(`/workspace/${id}`),
  create: (data: { name: string; description?: string; wallet_address?: string }) =>
    api.post('/workspace', data),
  update: (id: string, data: { name: string; description?: string }) =>
    api.put(`/workspace/${id}`, data),
  delete: (id: string) => api.delete(`/workspace/${id}`),
};

// Files APIs
export const filesApi = {
  getAll: (workspaceId: string) => api.get(`/files/${workspaceId}`),
  getById: (workspaceId: string, fileId: string) =>
    api.get(`/files/${workspaceId}/${fileId}`),
  save: (workspaceId: string, data: { path: string; content: string; language: string }) =>
    api.post(`/files/${workspaceId}`, data),
  delete: (workspaceId: string, fileId: string) =>
    api.delete(`/files/${workspaceId}/${fileId}`),
  export: (workspaceId: string) =>
    api.get(`/files/${workspaceId}/export`, { responseType: 'blob' }),
};

// Chat APIs
export const chatApi = {
  getHistory: (workspaceId: string, agentType: 'builder' | 'question') =>
    api.get(`/chat/${workspaceId}/${agentType}`),
  sendMessage: (workspaceId: string, agentType: 'builder' | 'question', message: string, walletAddress?: string | null) =>
    api.post(`/chat/${workspaceId}/${agentType}`, { message, walletAddress }),
  clearHistory: (workspaceId: string, agentType: 'builder' | 'question') =>
    api.delete(`/chat/${workspaceId}/${agentType}`),
};

export default api;

