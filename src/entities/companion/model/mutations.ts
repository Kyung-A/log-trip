import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ICompanionRequest } from './types';
import { companionsKeys } from './queryKeys';
import { createCompanions, deleteCompanion } from '../api';

const companionMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (data: ICompanionRequest) => createCompanions(data),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: (id: string) => deleteCompanion(id),
    }),
};

export const useCreateCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...companionMutations.create(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companionsKeys.lists() });
    },
  });
};

export const useDeleteCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...companionMutations.delete(),
    onSuccess: (_, postId) => {
      qc.invalidateQueries({
        queryKey: companionsKeys.list(postId),
        refetchType: 'active',
      });
    },
  });
};
