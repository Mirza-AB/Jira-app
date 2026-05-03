import { useMutation } from '@tanstack/react-query';
import { register as registerApi } from '../services/authService';

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
