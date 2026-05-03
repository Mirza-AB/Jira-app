import { authApi } from '../lib/api';
import type { AuthRequest, AuthResponse, RegisterRequest } from '../types/auth';

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await authApi.login(data);
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await authApi.register(data);
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await authApi.refreshToken(token);
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
};
