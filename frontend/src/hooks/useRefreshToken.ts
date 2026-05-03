import { useMutation } from '@tanstack/react-query';
import { refreshToken as refreshApi } from '../services/authService';

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshApi,
  });
};
