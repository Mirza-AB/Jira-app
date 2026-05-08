import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../lib/api';

export const useTickets = (projectKey: string) => {
  return useQuery({
    queryKey: ['tickets', projectKey],
    queryFn: () => ticketApi.list(projectKey),
    enabled: !!projectKey,
  });
};
