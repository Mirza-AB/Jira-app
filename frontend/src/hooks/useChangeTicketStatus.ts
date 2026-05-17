import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../lib/api';

export const useChangeTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, toStatus }: { id: number; toStatus: string }) =>
      ticketApi.changeStatus(id, toStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};