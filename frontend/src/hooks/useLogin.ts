import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../services/authService';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};
