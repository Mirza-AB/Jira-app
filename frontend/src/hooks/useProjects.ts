import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../lib/api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.list,
  });
};