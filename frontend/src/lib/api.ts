import axios, { AxiosError } from 'axios';
import type { AuthRequest, AuthResponse, RegisterRequest } from '../types/auth';
import type { Ticket, TicketCreate, TicketPage } from '../types/ticket';
import type { Project, ProjectCreate } from '../types/project';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: AuthRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    api.post<unknown>('/auth/register', data).then((res) => res.data),

  refreshToken: (refreshToken: string) =>
    api
      .post<AuthResponse>('/auth/refresh', { refreshToken })
      .then((res) => res.data),
};

export const ticketApi = {
  list: (projectKey: string, page = 0, size = 50) =>
    api
      .get<TicketPage>('/tickets', { params: { projectKey, page, size } })
      .then((res) => res.data),

  create: (data: TicketCreate) =>
    api.post<Ticket>('/tickets', data).then((res) => res.data),

  changeStatus: (id: number, toStatus: string) =>
    api
      .post<Ticket>(`/tickets/${id}/status`, null, {
        params: { toStatus },
      })
      .then((res) => res.data),

  getComments: (ticketId: number) =>
    api.get<Comment[]>(`/comments/${ticketId}`).then((res) => res.data),

  addComment: (ticketId: number, content: string) =>
    api
      .post<Comment>(`/comments/${ticketId}`, content)
      .then((res) => res.data),
};

export const projectApi = {
  create: (data: ProjectCreate) =>
    api.post<Project>('/projects', data).then((res) => res.data),

  addMember: (key: string, username: string, role: string) =>
    api
      .post(`/projects/${key}/members`, username, { params: { role } })
      .then((res) => res.data),
};

interface Comment {
  id: number;
  content: string;
  author: { username: string };
  createdAt: string;
}